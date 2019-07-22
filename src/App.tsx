import React from 'react';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router';
import Auth from './pages/Auth/auth.component';
import SnackbarFeedback from './components/notification/snackbar.component';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

const App: React.FC = () => {
  return (
    <>
      <MuiThemeProvider theme={theme}>
        <SnackbarFeedback/>
        <Switch>
          <Route exact path="/" component={Auth}/>
          <Route path="/sign_up" component={
            (props: any) => <Auth {...props} isSignUp={true} />
          } />
        </Switch>
      </MuiThemeProvider>
    </>
  );
};

export default App;
