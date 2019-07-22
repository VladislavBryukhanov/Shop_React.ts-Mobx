import { observable, action, runInAction } from 'mobx';
import { ICredentials, IUser } from '../types/user';

import axios from 'axios';
import rootStore from './rootStore';
import { AuthState } from '../common/constants';
const axiosAuth = axios.create({
  baseURL: process.env.REACT_APP_CORE_API,
  withCredentials: true,
});

export class AuthStore {
  @observable me: IUser | null = null;
  @observable authState: string | null = null;

  @action
  async signIn(credentials: ICredentials) {
    try {
      await axiosAuth.post('/sign_in', credentials);
      await this.getMe();
    } catch (err) {
      await rootStore.errorHandler(err, 'SignIn');
    }
  }

  @action
  async signUp(user: IUser) {
    try {
      await axiosAuth.post('/sign_up', user);
      await this.getMe();
    } catch (err) {
      await rootStore.errorHandler(err, 'SignUp');
    }
  }

  @action
  async signOut() {
    try {
      await axiosAuth.post('/sign_out');
      runInAction(() => {
        this.me = null;
        this.authState = AuthState.SignedOut;
      });
    } catch (err) {
      await rootStore.errorHandler(err, 'SignOut');
    }
  }

  @action
  async getMe() {
    try {
      const me = await axiosAuth.get('/me')
        .then(res => res.data);

      runInAction(() => {
        this.me = me;
        this.authState = AuthState.SignedIn;
      });
    } catch (err) {
      await rootStore.errorHandler(err, 'getMe');
    }
  }
}

export default new AuthStore();
