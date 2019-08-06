import React from 'react';
import clsx from 'clsx';
import {
  withStyles,
  Drawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Icon,
  Avatar,
  Badge
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import GradeIcon from '@material-ui/icons/Grade';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import { inject, observer } from 'mobx-react';
import { AuthStore } from '../../stores/authStore';
import { CategoriesStore } from '../../stores/categoriesStore';
import { AdapterLink } from '../material-button-link/material-button-link.component';
import { styles } from './navigation-drawer.styles';
import { FileResources, Roles } from '../../common/constants';
import { CartStore } from '../../stores/cartStore';
import { computed } from 'mobx';

interface INavigationDrawerProps {
  authStore?: AuthStore;
  categoriesStore?: CategoriesStore;
  cartStore?: CartStore;
  classes: any
}
interface INavigationDrawerState {
  drawerOpened: boolean;
  categoriesCollapsed: boolean;
  adminCollapsed: boolean;
  [key: string]: boolean;
}

@inject('authStore', 'categoriesStore', 'cartStore')
@observer
class NavigationDrawer extends React.Component<INavigationDrawerProps, INavigationDrawerState> {
  @computed
  get isMeUser() {
    return this.props.authStore!.me!.Role!.name === Roles.USER;
  }

  // TODO change state to mobx observable
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
    this.props.cartStore!.fetchShoppingCart();
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

            <ListItem
              button
              selected={drawerOpened && categoriesCollapsed}
              onClick={() => this.openCollapse('categoriesCollapsed')}
            >
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

            { !this.isMeUser && (
              <>
                <ListItem button
                  onClick={() => this.openCollapse('adminCollapsed')} 
                  selected={drawerOpened && adminCollapsed}
                >
                  <ListItemIcon>
                    <Icon>settings_applications</Icon>
                  </ListItemIcon>
                  <ListItemText primary="Admin" />
                  {adminCollapsed ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={drawerOpened && adminCollapsed} timeout="auto" unmountOnExit>
                  <ListItem
                    button
                    component={AdapterLink}
                    to="/product_manager"
                  >
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
    
                  <ListItem
                    button
                    component={AdapterLink}
                    to="/users"
                  >
                    <ListItemText inset primary="Users" />
                    <ListItemIcon>
                      <Icon>people</Icon>
                    </ListItemIcon>
                  </ListItem>
                </Collapse>
              </>
            )}

            <ListItem
              button
              component={AdapterLink}
              to="/shopping_cart"
            >
              <ListItemIcon>
                <Badge badgeContent={this.props.cartStore!.productsCount} color="secondary">
                  <Icon>shopping_cart</Icon>
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Shopping cart" />
            </ListItem>

            <ListItem
              button
              component={AdapterLink}
              to="/orders"
            >
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
