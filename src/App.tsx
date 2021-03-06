import React from 'react';
import { Switch } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core';

import { Roles } from './common/constants';
import { SnackbarFeedback } from './components/snackbar-feedback/snackbar-feedback.component';
import { ConfirmationDialog } from './components/confirmation-dialog/confirmation-dialog.component';
import { RouteGuard } from './components/route-guard/route-guard.component';
import './App.scss';

import { theme } from './assets/themas/App.theme';
import { AuthPage } from './pages/Auth/auth.component';
import ShoppingCartPage from './pages/ShoppingCart/shopping-cart.component';
import ProductListPage from './pages/ProductList/product-list.component';
import ProductBuilderPage from './pages/Admin-module/ProductBuilder/product-builder.component';
import { CategoriesManagerPage } from './pages/Admin-module/CategoriesManager/categories-manager.component';
import { NotFoundPage } from './pages/NotFound/not-found.component';
import OrderListPage from './pages/OrderList/order-list.component';
import UserManagerPage from './pages/Admin-module/UserManager/user-manager.component';

const App: React.FC = () => {
  return (
    <div className="AppBody">
      <MuiThemeProvider theme={theme}>
        {/*TODO mb replace to portal?*/}
        <SnackbarFeedback/>
        <ConfirmationDialog/>
        <CssBaseline />

        <Switch>
          <RouteGuard
            requiredGuest={true}
            exact path="/"
            component={AuthPage}
          />

          <RouteGuard
            requiredGuest={true}
            exact path="/sign_up"
            render={ (props: any) => <AuthPage {...props} isSignUp={true} /> }
          />

          <RouteGuard
            requiredAuth={true}
            exact path="/top_products"
            render={ (props: any) => <ProductListPage {...props} topProducts={true} /> }
          />

          <RouteGuard
            requiredAuth={true}
            exact path="/products/:category"
            component={ProductListPage}
          />

          <RouteGuard
            requiredRoles={[ Roles.MANAGER, Roles.ADMIN ]}
            exact path="/categories_manager"
            component={CategoriesManagerPage}
          />

          <RouteGuard
            requiredRoles={[ Roles.MANAGER, Roles.ADMIN ]}
            exact path="/product_manager"
            component={ProductBuilderPage}
          />

          <RouteGuard
            requiredAuth={true}
            exact path="/shopping_cart"
            component={ShoppingCartPage}
          />

          <RouteGuard
            requiredAuth={true}
            exact path="/orders"
            component={OrderListPage}
          />

          <RouteGuard
            requiredRoles={[ Roles.MANAGER, Roles.ADMIN ]}
            exact path="/review_order/:userId"
            component={OrderListPage}
          />

          <RouteGuard
            requiredRoles={[ Roles.MANAGER, Roles.ADMIN ]}
            exact path="/users"
            component={UserManagerPage}
          />

          <RouteGuard
            exact path="*"
            component={NotFoundPage}
          />

        </Switch>
      </MuiThemeProvider>
    </div>
  );
};

export default App;
