import { observable, computed, action } from 'mobx';
import { IUser } from '../types/user';

class AuthStore {
  @observable me: IUser | null = null;
  @observable authState: string | null = null;
}

export default new AuthStore();