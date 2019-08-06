import React from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';
import { AuthState, Roles } from '../../common/constants';
import { AuthStore } from '../../stores/authStore';
import { RouteProps } from 'react-router';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigationDrawer from '../navigation-drawer/navigation-drawer.component';
import { NotFoundPage } from '../../pages/NotFound/not-found.component';
import { ToolBar } from '../toolbar/toolbar.component';
import OpenChatButton from '../Chat/open-chat-button/open-chat-button.component';

interface IRouteGuard extends RouteProps{
  requiredRoles?: string[];
  requiredAuth?: boolean;
  requiredGuest?: boolean;
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

  visibleContent() {
    const { authState, me } = this.props.authStore!;
    const { requiredAuth, requiredGuest, requiredRoles } = this.props;

    if ((requiredAuth || requiredRoles) && authState === AuthState.SignedOut) {
      return <Redirect to='/'/>
    } else if (requiredGuest && authState === AuthState.SignedIn) {
      return <Redirect to='/top_products'/>
    } else if (requiredRoles && !(requiredRoles.includes(me!.Role!.name))) {
      return <NotFoundPage/>;
    }

    return (
      <div className="Page">
        <Route {...this.props}/>
      </div>
    )
  }

  render() {
    const { authState, me } = this.props.authStore!;
    return (
      <>
      {authState ? (
        <>
          {authState === AuthState.SignedIn ? <NavigationDrawer/> : <ToolBar/>}
          {this.visibleContent()}
          { me && me.Role!.name === Roles.USER && (
            <OpenChatButton/>
          )}
        </>
      ) : (
        <Grid container
              className="Page"
              justify="center"
              alignItems="center"
        >
          <CircularProgress size={100}/>
        </Grid>
      )}
      </>
    )
  }
}
