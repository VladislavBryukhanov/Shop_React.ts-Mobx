import { action, observable } from 'mobx';
import { AxiosError } from 'axios';
import authStore from './authStore';

export class RootStore {
 @observable snackbar = {
   message: '',
   duration: 0,
   open: false
 };

  @action
  errorHandler = async (err: AxiosError, action: string, delay?: number) => {
    if (!err.response) {
      return console.error(err);
    }

    const { status, data } = err.response;
    if (status === 401 || status === 403) {
      await authStore.signOut();
    }
    this.showSnackbar(`${action}: ${data}`, delay);
  };

  @action
  showSnackbar = (message: string, duration = 2000) => {
    this.snackbar = {
      open: true,
      message,
      duration
    }
  };

  @action
  hideSnackbar = () => {
    this.snackbar.open = false;
  }
}

export default new RootStore();
