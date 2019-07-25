import React from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';
import { AuthState } from '../../common/constants';
import { AuthStore } from '../../stores/authStore';
import { RouteProps } from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

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
        redirectTo = '/product_list';
      } else if ((!requiredAuth && !requiredRole) && (authState !== AuthState.SignedOut)) {
        redirectTo = '/product_list';
      }
    }

    return (
      <>
      {this.props.authStore!.authState ? (
        <>
          {redirectTo ? (
            <Redirect to={redirectTo}/>
          ) : (
            <Route {...this.props}/>
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