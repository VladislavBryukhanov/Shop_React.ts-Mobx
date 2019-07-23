import React from 'react';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router';
import Auth from './pages/Auth/auth.component';
import SnackbarFeedback from './components/notification/snackbar.component';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    // primary: '#1A567B',
    // secondary: {
    //   main: '#f44336',
    // },
    primary: {
      light: '#6B9BC2',
      main: '#558DC4',
      dark: '#1A567B',
      contrastText: '#fff',
    },
    secondary: {
      light: '#6B9BC2',
      main: '#00aca2',
      dark: '#00726a',
      contrastText: '#243443',
    },
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
