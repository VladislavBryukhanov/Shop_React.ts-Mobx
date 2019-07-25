import React from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';
import { AuthState } from '../../common/constants';
import { AuthStore } from '../../stores/authStore';
import { RouteProps } from 'react-router';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigationDrawer from '../navigation-drawer/navigation-drawer.component';

interface IRouteGuard extends RouteProps{
  requiredRole?: string;
  requiredAuth?: boolean;
  authStore?: AuthStore;
}

@inject('authStore')
@observer
export class RouteGuard extends React.Component<IRouteGuard> {
  async componentDidMount() {
    if (!this.props.authStore!.authState) {
      await this.props.authStore!.getMe();
    }
  }

  render() {
    const { authState, me } = this.props.authStore!;
    const { requiredAuth, requiredRole } = this.props;

    let redirectTo = '';

    if (authState) {
      if (requiredAuth && !(authState === AuthState.SignedIn)) {
        redirectTo = '/';
      } else if (requiredRole && (me!.Role!.name !== requiredRole)) {
        // TODO redirect to 404 page
        redirectTo = '/top_products';
      } else if ((!requiredAuth && !requiredRole) && (authState !== AuthState.SignedOut)) {
        redirectTo = '/top_products';
      }
    }

    return (
      <>
      {this.props.authStore!.authState ? (
        <>
          {redirectTo ? (
            <Redirect to={redirectTo}/>
          ) : (
            <div>
              {authState === AuthState.SignedIn && <NavigationDrawer/>}
              <Route {...this.props}/>
            </div>
          )}
        </>
      ) : (
        <Grid container
              justify="center"
              className="Page"
              alignItems="center"
        >
          <CircularProgress size={100}/>
        </Grid>
      )}
      </>
    )
  }
}
