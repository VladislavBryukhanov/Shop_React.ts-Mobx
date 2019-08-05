import React from 'react';
import { observable, toJS } from 'mobx';
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
  Select
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { IUser } from '../../../types/user';
import { RootStore } from '../../../stores/rootStore';
import { UsersStore } from '../../../stores/usersStore';
import { dateFormatFilter } from '../../../common/helpers/dateFormatFilter';
import PaginationComponent from '../../../components/pagination/pagination.component';
import { USERS_ONE_PAGE_LIMIT } from '../../../common/constants';
import { IPagingQuery } from '../../../types/pagingQuery';
import { withPagingQuery } from '../../../components/pagination/withPagingQuery';
import { styles } from './user-list.styles';

interface IUserManageProps {
  usersStore?: UsersStore;
  rootStore?: RootStore;
  query: IPagingQuery;
  classes: any;
}

interface ICollapsable {
  [key: number]: boolean
}

@inject('usersStore', 'rootStore')
@observer
class UserManagerPage extends React.Component<IUserManageProps> {
  @observable.deep
  collapse: ICollapsable = {};

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

  render() {
    const { users, usersCount, availableRoles } = this.props.usersStore!;
    const { classes } = this.props;

    return (
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
                        >
                          Open chat
                        </Button>
                      </Box>

                      <Box flexGrow={1}>
                        <Button fullWidth={true}>
                          Show order list
                        </Button>
                      </Box>

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
                    </Box>
                
                  </Collapse>
                </div>
            ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withPagingQuery(UserManagerPage)
);