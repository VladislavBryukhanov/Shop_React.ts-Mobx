import axios from 'axios';
import { action, observable, runInAction } from 'mobx';
import rootStore from './rootStore';
import { IPagingQuery } from '../types/pagingQuery';
import { IOrder } from '../types/order';

const axiosOrder = axios.create({
  baseURL: `${process.env.REACT_APP_CORE_API}/order`,
  withCredentials: true
});

export class OrderStore {
  @observable
  orders: IOrder[] = [];

  @action
  async fetchOrders(paging: IPagingQuery) {
    const { currentPage, limit } = paging;
    const offset = (currentPage - 1) * limit;

    try {
      const { data: orders } = await axiosOrder.get('/fetch_orders', {
        params: { offset, limit }
      });

      runInAction(() => {
        this.orders = orders;
      });
    } catch (err) {
      await rootStore.errorHandler(err, 'FetchOrders');
    }
  }

  @action
  async fetchUsersOrder(id: number) {
    try {
      const { data: orders } = await axiosOrder.get(`/fetch_users_order/${id}`);

      runInAction(() => {
        this.orders = orders;
      });
    } catch (err) {
      await rootStore.errorHandler(err, 'FetchUsersOrders');
    }
  }

  @action
  async fetchPersonalOrders() {
    try {
      const { data: orders } = await axiosOrder.get('/fetch_personal_orders');

      runInAction(() => {
        this.orders = orders;
      });
    } catch (err) {
      await rootStore.errorHandler(err, 'FetchPersonalOrders');
    }
  }

  @action
  async createPersonalOrder(productIds: number[]) {
    try {
      await axiosOrder.post('/create_personal_order', { productIds });
    } catch (err) {
      await rootStore.errorHandler(err, 'CreatePersonalOrder');
    }
  }

  @action
  async declineOrder(orderId: number) {
    try {
      await axiosOrder.delete(`/decline_order/${orderId}`);

      runInAction(() => {
        const index = this.orders.findIndex(order => order.id === orderId);
        this.orders.splice(index, 1);
      });
    } catch (err) {
      await rootStore.errorHandler(err, 'DeclineOrder');
    }
  }
}

export default new OrderStore();