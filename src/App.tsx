import React from 'react';
import { Switch } from 'react-router';
import AuthPage from './pages/Auth/auth.component';
import SnackbarFeedback from './components/snackbar-feedback/snackbar-feedback.component';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { ProductListPage } from './pages/ProductList/product-list.component';
import { RouteGuard } from './components/route-guard/route-guard.component';
import { NotFoundPage } from './pages/NotFound/not-found.component';
import './App.scss'
import { NavigationDrawer } from './components/navigation-drawer/navigation-drawer.component';

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
    <div className="AppBody">
      <MuiThemeProvider theme={theme}>
        <SnackbarFeedback/>
        <NavigationDrawer/>
        <Switch>
          <RouteGuard
            exact path="/"
            component={AuthPage}
          />

          <RouteGuard
            exact path="/sign_up"
            component={
              (props: any) => <AuthPage {...props} isSignUp={true} />
            }
          />

          <RouteGuard
            requiredAuth={true}
            exact path="/product_list"
            component={ProductListPage}
          />

          {/*Fixme*/}
        {/*  <RouteGuard
            path="*"
            component={NotFoundPage}
          />*/}
        </Switch>
      </MuiThemeProvider>
    </div>
  );
};

export default App;
