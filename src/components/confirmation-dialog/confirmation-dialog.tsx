import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { RootStore } from '../../stores/rootStore';

const dialogTheme = createMuiTheme({
  palette: {
    secondary: {
      main: '#1A567B'
    },
    primary: {
      main: '#cd544e',
    },
  },
});

interface IConfirmationDialog {
  rootStore?: RootStore
}
export const ConfirmationDialog: React.FC<IConfirmationDialog> = inject('rootStore')(
  observer((props: IConfirmationDialog) => {
    const { open, title, message } = props.rootStore!.dialog;
    const { dialogResult } = props.rootStore!;

    return (
      <MuiThemeProvider theme={dialogTheme}>
        <Dialog open={open} onClose={() => dialogResult(false)}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => dialogResult(false)}>cancel</Button>
            <Button color="secondary" onClick={() => dialogResult(true)} autoFocus>Confirm</Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    )
  }
));
