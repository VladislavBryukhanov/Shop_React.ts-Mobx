import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Icon, MuiThemeProvider, Box } from '@material-ui/core';
import { lightTheme } from '../../../assets/themas/light.theme';
import { styles } from './message-input.styles';
import { withStyles } from '@material-ui/styles';
import { ChatStore } from '../../../stores/chatStore';
import { inject, observer } from 'mobx-react';

interface IMessageInputProps {
  classes: any;
  chatStore?: ChatStore;
}

const MessageInput: React.FC<IMessageInputProps> = inject('chatStore')(observer(
  (props: IMessageInputProps) => {
    const { classes } = props;
    const [ message, setMessage ] = useState('');
    const sendMessage = (e: any) => {
      e.preventDefault();
      props.chatStore!.sendMessage(message);
      setMessage('');
    };

    return (
      <MuiThemeProvider theme={lightTheme}>
        <Paper className={classes.messageInput}>
          <form onSubmit={sendMessage}>
            <Box ml={2} display="flex">
              <InputBase
                className={classes.textField}
                value={message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                placeholder="Enter message"
              />
              <IconButton type="submit">
                <Icon>send</Icon>
              </IconButton>
            </Box>
          </form>
        </Paper>
      </MuiThemeProvider>
    )
  }
))

export default withStyles(styles)(MessageInput);