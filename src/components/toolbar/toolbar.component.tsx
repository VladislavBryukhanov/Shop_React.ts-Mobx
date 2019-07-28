import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { AdapterLink } from '../material-button-link/material-button-link.component';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { FileResources } from '../../common/constants';

export const ToolBar: React.FC = () => (
  <AppBar color="default">
    <Toolbar>
      <Avatar src={FileResources.logo}/>
      <Button component={AdapterLink} to='/'> Sign in</Button>
      <Button component={AdapterLink} to='/sign_up'> Sign up</Button>
    </Toolbar>
  </AppBar>
);