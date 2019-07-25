import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
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

const drawerWidth = 310;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
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
  }),
);

export const NavigationDrawer: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [categoriesCollapse, setCategoriesCollapse] = React.useState(false);
  const [adminCollapse, setAdminCollapse] = React.useState(false);

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          {open && <Avatar src="./logo.svg" className={classes.logo}/>}
          <IconButton onClick={() => setOpen(!open)} >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem button>
              <ListItemIcon>
                <GradeIcon/>
              </ListItemIcon>
              <ListItemText primary="Top popular" />
            </ListItem>


          <ListItem button onClick={() => setCategoriesCollapse(!categoriesCollapse)}>
            <ListItemIcon>
              <Icon>dashboard</Icon>
            </ListItemIcon>
            <ListItemText primary="Categories" />
            {categoriesCollapse ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open && categoriesCollapse} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button>
                <ListItemText inset primary="Starred" />
                <ListItemIcon>
                  <Icon>dashboard</Icon>
                </ListItemIcon>
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={() => setAdminCollapse(!adminCollapse)}>
            <ListItemIcon>
              <Icon>settings_applications</Icon>
            </ListItemIcon>
            <ListItemText primary="Categories" />
            {adminCollapse ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open && adminCollapse} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button>
                <ListItemText inset primary="Create product" />
                <ListItemIcon>
                  <Icon>add</Icon>
                </ListItemIcon>
              </ListItem>
            </List>
            <List component="div" disablePadding>
              <ListItem button>
                <ListItemText inset primary="Manage categories" />
                <ListItemIcon>
                  <Icon>add_to_photos</Icon>
                </ListItemIcon>
              </ListItem>
            </List>
            <List component="div" disablePadding>
              <ListItem button>
                <ListItemText inset primary="Users" />
                <ListItemIcon>
                  <Icon>people</Icon>
                </ListItemIcon>
              </ListItem>
            </List>
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

          <ListItem button>
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