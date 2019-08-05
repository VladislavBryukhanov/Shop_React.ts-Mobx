import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Grid, withStyles, Box, Toolbar, Avatar, Typography } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { ChatStore } from '../../stores/chatStore';
import { IMessage } from '../../types/message';
import MessageInput from '../../components/Chat/message-input/message-input.component';
import { styles } from './chat.styles';
import { FileResources, Roles } from '../../common/constants';
import { AuthStore } from '../../stores/authStore';
import moment from 'moment';
import { IUser } from '../../types/user';
import { computed } from 'mobx';

interface IChatProps extends RouteComponentProps {
  chatStore?: ChatStore;
  authStore?: AuthStore;
  interlocutor?: IUser;
  classes: any
}

@inject('chatStore', 'authStore')
@observer
class Chat extends React.Component<IChatProps> {

  async componentDidMount() {
    let interlocutorId;
    if (this.props.interlocutor) {
      interlocutorId = this.props.interlocutor.id;
    }
    
    this.props.chatStore!.initConnection();
    await this.props.chatStore!.openChat(interlocutorId);
    this.props.chatStore!.fetchMessages();
  }

  @computed
  get interlocutorUser() {
    const { customer, seller } = FileResources;

    if (this.props.authStore!.me!.Role!.name === Roles.USER) {
      return {
        avatar: seller,
        firstName: 'Sales',
        lastName: 'Manager'
      }
    }
    return {
      ...this.props.interlocutor,
      avatar: customer
    }
  }
  
  componentWillUnmount() {
    this.props.chatStore!.closeConnection();
  }

  getMessageType(message: IMessage) {
    const { interlocutor } = this.props;
    if (interlocutor && interlocutor.id !== message.UserId) {
      return 'outcome';
    }

    if (this.props.authStore!.me!.id === message.UserId) {
      return 'outcome';
    }
    return 'incoming';
  }
  formatDateTime = (value: string) => moment(value).format('hh:mm:ss');
  formatDateDay = (value: string) => moment(value).format('DD MMM');

  render() {
    const { classes } = this.props;
    
    return (
      <Grid container className={classes.chatBody}>
        <Toolbar className={classes.toolbar}>
          <Avatar src={this.interlocutorUser.avatar}/>
          <Box ml={2}>
            <Typography color="secondary">
              {`${this.interlocutorUser.firstName} ${this.interlocutorUser.lastName}`}
            </Typography>
          </Box>
        </Toolbar>

        <Grid className={classes.messageList}>
          {
            this.props.chatStore!.messages.map((message: IMessage) => (
              <div key={message.id} className={`${classes.message}`}>
                
                <div className={this.getMessageType(message)}>
                  <span className="content">{message.textContent}</span>
                  <div className="dateOfSend">
                    <div>{this.formatDateTime(message.createdAt)}</div>
                    <div>{this.formatDateDay(message.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))
          }
        </Grid>
        <Grid className={classes.messageInput}>
          <MessageInput/>
        </Grid>
      </Grid>
    )
  }   
}

export default withStyles(styles)(
  withRouter(Chat)
);