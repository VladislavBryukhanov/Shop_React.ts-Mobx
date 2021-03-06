import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import authStore from './stores/authStore';
import rootStore from './stores/rootStore';
import categoriesStore from './stores/categoriesStore';
import productsStore from './stores/productsStore';
import cartStore from './stores/cartStore';
import orderStore from './stores/orderStore';
import usersStore from './stores/usersStore';
import chatStore from './stores/chatStore';
import App from './App';
import './index.scss'

const stores = {
  rootStore,
  authStore,
  categoriesStore,
  productsStore,
  cartStore,
  orderStore,
  usersStore,
  chatStore
};

ReactDOM.render((
  <Provider {...stores} >
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
