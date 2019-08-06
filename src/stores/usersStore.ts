import { observable, runInAction, action } from "mobx";
import axios from 'axios';
import { IUser, IRole } from "../types/user";
import rootStore from "./rootStore";
import { IPagingQuery } from "../types/pagingQuery";
import _ from 'lodash';

const axiosUsers = axios.create({
  baseURL: `${process.env.REACT_APP_CORE_API}/users`,
  withCredentials: true
});

export class UsersStore {
    @observable
    users: IUser[] = [];
    @observable
    usersCount: number = 0;
    @observable
    availableRoles: IRole[] = [];

    @action
    async fetchRoleList() {
      try {
        const { data: roles } = await axiosUsers.get('/fetch_role_list');
        runInAction(() => {
          this.availableRoles = roles;
        });
      } catch (err) {
        await rootStore.errorHandler(err, 'FetchRoleList');
      }
    }

    @action
    async fetchUsers(paging: IPagingQuery) {
      const { currentPage, limit } = paging;
      const offset = (currentPage - 1) * limit;
  
      try {
        const { data: users } = await axiosUsers.get('/fetch_users', {
          params: { offset, limit }
        });
        
        runInAction(() => {
          this.users = users.rows;
          this.usersCount = users.count;
        }); 
      } catch (err) {
        await rootStore.errorHandler(err, 'FetchUsers');
      }
    }

    @action
    async updateUserRole(role: IRole, userId: number) {
      try {
        await axiosUsers.put(`/update_role/${userId}`, { role });
        runInAction(() => {
          const index = _.findIndex(this.users, { id: userId });
          const updatedUser = this.users[index];
      
          updatedUser.Role = role;
          this.users.splice(index, 1, updatedUser);
        });
      } catch (err) {
        await rootStore.errorHandler(err, 'UpdateUserRole');
      }
    }
}

export default new UsersStore();
