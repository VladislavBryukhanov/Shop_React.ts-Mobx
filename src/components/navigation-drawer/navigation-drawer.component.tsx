import React from 'react';
import clsx from 'clsx';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GradeIcon from '@material-ui/icons/Grade';

import { ExpandLess, ExpandMore } from '@material-ui/icons';
import Collapse from '@material-ui/core/Collapse';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import { inject, observer } from 'mobx-react';
import { AuthStore } from '../../stores/authStore';
import { CategoriesStore } from '../../stores/categoriesStore';
import { AdapterLink } from '../material-button-link/material-button-link.component';
import { FileResources } from '../../common/constants';

const drawerWidth = 310;
const styles = (theme: Theme) => createStyles({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 4px',
    ...theme.mixins.toolbar,
  },
  logo: {
    display: 'contents',
  }
});

interface INavigationDrawerProps {
  authStore?: AuthStore;
  categoriesStore?: CategoriesStore;
  classes: any
}
interface INavigationDrawerState {
  drawerOpened: boolean;
  categoriesCollapsed: boolean;
  adminCollapsed: boolean;
  [key: string]: boolean;
}
@inject('authStore', 'categoriesStore')
@observer
class NavigationDrawer extends React.Component<INavigationDrawerProps, INavigationDrawerState> {
  constructor(props: INavigationDrawerProps) {
    super(props);
    this.state = {
      drawerOpened: false,
      categoriesCollapsed: false,
      adminCollapsed: false,
    };
  }

  componentDidMount() {
    this.props.categoriesStore!.fetchCategories();
  }

  openCollapse = (name: string) => {
    if (!this.state.drawerOpened) {
      this.setState({ drawerOpened: true });
    }
    this.setState({ [name]: !this.state[name] });
  };

  public render() {
    const { classes } = this.props;
    const { drawerOpened, categoriesCollapsed, adminCollapsed } = this.state;

    return (
      <div>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: drawerOpened,
            [classes.drawerClose]: !drawerOpened,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: drawerOpened,
              [classes.drawerClose]: !drawerOpened,
            }),
          }}
          open={drawerOpened}
        >
          <div className={classes.toolbar}>
            {drawerOpened && <Avatar src={FileResources.logo} className={classes.logo}/>}
            <IconButton onClick={() => this.setState({ drawerOpened: !drawerOpened })} >
              {drawerOpened ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button component={AdapterLink} to="/top_products">
              <ListItemIcon>
                <GradeIcon/>
              </ListItemIcon>
              <ListItemText primary="Top popular" />
            </ListItem>

            <ListItem button onClick={() => this.openCollapse('categoriesCollapsed')}>
              <ListItemIcon>
                <Icon>dashboard</Icon>
              </ListItemIcon>
              <ListItemText primary="Categories" />
              {categoriesCollapsed ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={drawerOpened && categoriesCollapsed} timeout="auto" unmountOnExit>
              {this.props.categoriesStore! && this.props.categoriesStore!.categories.map(category => (
                <ListItem
                  button key={category.id}
                  component={AdapterLink}
                  to={`/products/${category.name}`}>
                  <ListItemText inset primary={category.name} />
                </ListItem>
              ))}
            </Collapse>

            <ListItem button onClick={() => this.openCollapse('adminCollapsed')}>
              <ListItemIcon>
                <Icon>settings_applications</Icon>
              </ListItemIcon>
              <ListItemText primary="Admin" />
              {adminCollapsed ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={drawerOpened && adminCollapsed} timeout="auto" unmountOnExit>
                <ListItem button>
                  <ListItemText inset primary="Create product" />
                  <ListItemIcon>
                    <Icon>add</Icon>
                  </ListItemIcon>
                </ListItem>

                <ListItem
                  button
                  component={AdapterLink}
                  to="/categories_manager"
                >
                  <ListItemText inset primary="Manage categories" />
                  <ListItemIcon>
                    <Icon>add_to_photos</Icon>
                  </ListItemIcon>
                </ListItem>

                <ListItem button>
                  <ListItemText inset primary="Users" />
                  <ListItemIcon>
                    <Icon>people</Icon>
                  </ListItemIcon>
                </ListItem>
            </Collapse>

            <ListItem button>
              <ListItemIcon>
                <Icon>shopping_cart</Icon>
              </ListItemIcon>
              <ListItemText primary="Shopping cart" />
            </ListItem>

            <ListItem button>
              <ListItemIcon>
                <Icon>list_alt</Icon>
              </ListItemIcon>
              <ListItemText primary="Orders list" />
            </ListItem>

            <ListItem button onClick={() => this.props.authStore!.signOut()}>
              <ListItemIcon>
                <Icon>power_settings_new</Icon>
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </ListItem>
          </List>
        </Drawer>
      </div>
    );
  }
}
export default withStyles(styles)(NavigationDrawer);
