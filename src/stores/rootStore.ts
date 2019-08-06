import { action, observable } from 'mobx';
import { AxiosError } from 'axios';
import { IDialog, ISnackbar } from '../types/confirmationUtils';
import authStore from './authStore';

export class RootStore {
  dialogAnswer!: (value?: unknown) => void;

  @observable
  snackbar: ISnackbar = {
   open: false,
   message: '',
   duration: 0
 };

 @observable
 dialog: IDialog = {
   open: false,
   title: '',
   message: '',
 };

  @action
  errorHandler = async (err: AxiosError, action: string, delay?: number) => {
    if (!err.response) {
      return console.error(err);
    }

    const { status, data } = err.response;
    if (status === 401 || status === 403) {
      // FIXME notify after user's auth fail, but prevent for firs auth request, add flag ?manually invoke
      return await authStore.signOut();
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
  };

  @action
  openConfirmationDialog = (title: string, message: string) => {
    this.dialog = {
      open: true,
      title,
      message
    };
    return new Promise((resolve, reject) => {
      this.dialogAnswer = resolve;
    });
  };

  @action
  dialogResult = (answer: boolean) => {
    this.dialog.open = false;
    this.dialogAnswer(answer);
  };
}

export default new RootStore();
