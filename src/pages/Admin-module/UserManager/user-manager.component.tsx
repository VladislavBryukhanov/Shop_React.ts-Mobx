import React from 'react';
import { observable, toJS, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import {
  Grid,
  Paper,
  List,
  Divider,
  ListItem,
  ListItemSecondaryAction,
  ListItemText, 
  Collapse,
  Button,
  withStyles,
  Typography,
  Box,
  MenuItem,
  Select,
  Dialog
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { IUser } from '../../../types/user';
import { RootStore } from '../../../stores/rootStore';
import { UsersStore } from '../../../stores/usersStore';
import { dateFormatFilter } from '../../../common/helpers/dateFormatFilter';
import PaginationComponent from '../../../components/pagination/pagination.component';
import { USERS_ONE_PAGE_LIMIT, Roles } from '../../../common/constants';
import { IPagingQuery } from '../../../types/pagingQuery';
import { withPagingQuery } from '../../../components/pagination/withPagingQuery';
import { styles } from './user-manager.styles';
import { AdapterLink } from '../../../components/material-button-link/material-button-link.component';
import { AuthStore } from '../../../stores/authStore';
import Chat from '../../Chat/chat.component';

interface ICollapsable {
  [key: number]: boolean
}
interface IUserManageProps {
  usersStore?: UsersStore;
  rootStore?: RootStore;
  authStore?: AuthStore;
  query: IPagingQuery;
  classes: any;
}

@inject('usersStore', 'authStore', 'rootStore')
@observer
class UserManagerPage extends React.Component<IUserManageProps> {
  @observable.deep
  collapse: ICollapsable = {};
  @observable
  isChatOpened: boolean = false;
  @observable
  selectedInterlocutor?: IUser;

  @computed
  get isAdmin() {
    return this.props.authStore!.me!.Role!.name === Roles.ADMIN;
  }

  componentDidMount() {
    this.fetchUsers({
      ...this.props.query,
      limit: USERS_ONE_PAGE_LIMIT
    });
    this.props.usersStore!.fetchRoleList();
  }

  openCollapse(lineId: number) {
    this.collapse[lineId] = !this.collapse[lineId];
  }

  fetchUsers = async (query: IPagingQuery) => {
    this.props.usersStore!.fetchUsers(query);
  };

  onRoleChanged = async (e: React.ChangeEvent<{ value: unknown }>, user: IUser) => {
    const roleId = e.target.value;
    const role = this.props.usersStore!.availableRoles.find(({ id }) => id === roleId);

    if(user.Role!.id === roleId || !role) {
      return;
    }

    const confirm = await this.props.rootStore!.openConfirmationDialog(
      'Confirm changes',
      `Do you want to change role for this user from [${user.Role!.name}] to [${role.name}]?`
    );
    if (confirm) {
      await this.props.usersStore!.updateUserRole(role, user.id!);
    }
  };

  openDialog(user: IUser) {
    this.selectedInterlocutor = user;
    this.isChatOpened = true;
  }

  render() {
    const { users, usersCount, availableRoles } = this.props.usersStore!;
    const { classes } = this.props;

    return (
      <>
        <Grid container
          className={classes.userList}
          justify="center"
          alignItems="center"
        >
          <Grid item xl={2} lg={2} md={1} />
          <Grid item xl={8} lg={8} md={10} sm={12} xs={12}>
            <PaginationComponent
              limit={USERS_ONE_PAGE_LIMIT}
              count={toJS(usersCount)}
              fetchingMethod={this.fetchUsers}
            />

            <Paper elevation={6}>
              <List>
                { users.map((user: IUser) => (
                  <div key={user.id!}>
                    <Divider/>
                    <ListItem button onClick={() => this.openCollapse(user.id!)}>
                      <ListItemText 
                        primary={user.email} 
                        secondary={`${user.firstName} ${user.lastName}`} />
                      <ListItemText
                        className={classes.creationDate}
                        primary={
                          <Typography color="primary">
                            {user.Role!.name}
                          </Typography>
                        }
                        secondary={`Account created at ${dateFormatFilter(user.createdAt!)}`} />
                      <ListItemSecondaryAction>
                        {this.collapse[user.id!] ? <ExpandLess /> : <ExpandMore />} 
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Collapse in={this.collapse[user.id!]} timeout="auto" unmountOnExit>

                      <Box display="flex">
                        <Box flexGrow={1}>
                          <Button
                            fullWidth={true}
                            color="primary"
                            onClick={() => this.openDialog(user)}
                          >
                            Open chat
                          </Button>
                        </Box>

                        <Box flexGrow={1}>
                          {/* TODO Button is not working issue: https://github.com/mui-org/material-ui/issues/16846 */}
                          {/* <Button>
                            component={AdapterLink}
                            to={{
                              path: '/orders',
                              search: `userId=${user.id}`
                            }}
                            fullWidth={true}
                          >
                            Show order list
                          </Button> */}

                          <ListItem
                            className={classes.buttonLinkWrapper}
                            component={AdapterLink}
                            to={`/review_order/${user.id}`}
                          >
                            <Button fullWidth={true}>
                              Show order list
                            </Button>
                          </ListItem>
                        </Box>

                        { this.isAdmin && (
                          <Box flexGrow={1}>
                            <Select
                              fullWidth={true}
                              variant="outlined"
                              onChange={(e) => this.onRoleChanged(e, user)}
                              value={user.Role!.id}
                            >
                              {
                                availableRoles.map(role =>
                                  <MenuItem value={role.id} key={role.id}>
                                    {role.name}
                                  </MenuItem>
                                )
                              }
                            </Select>
                          </Box>
                        )}
                        
                      </Box>
                  
                    </Collapse>
                  </div>
              ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
        <Dialog 
          fullWidth
          maxWidth={'xs'}
          open={this.isChatOpened}
          onClose={() => this.isChatOpened = false }
        >
          <Chat interlocutor={this.selectedInterlocutor}/>
        </Dialog>
      </>
    )
  }
}

export default withStyles(styles)(
  withPagingQuery(UserManagerPage)
);
