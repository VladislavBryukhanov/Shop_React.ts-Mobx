import axios from 'axios';
import rootStore from './rootStore';
import { action, observable, runInAction } from 'mobx';
import { IPagingQuery } from '../types/pagingQuery';
import { IProduct } from '../types/product';

const axiosCart = axios.create({
  baseURL: `${process.env.REACT_APP_CORE_API}/cart`,
  withCredentials: true
});

export class CartStore {
  @observable
  totalCost: number = 0;
  @observable
  productsCount: number = 0;
  @observable
  productIds: number[] = [];
  @observable
  products: IProduct[] = [];

  @action
  async fetchShoppingCart() {
    try {
      const { data: cart } = await axiosCart.get('/fetch_shopping_cart');

      runInAction(() => {
        this.productIds = cart.productsIds;
        this.totalCost = cart.totalCost;
        this.productsCount = cart.productsIds.length;
      });
    } catch (err) {
      await rootStore.errorHandler(err, 'FetchShoppingCart');
    }
  }

  @action
  async fetchCartProducts(paging: IPagingQuery) {
    const { currentPage, limit } = paging;
    const offset = (currentPage - 1) * limit;

    try {
      const { data: products } = await axiosCart.get('/fetch_products', {
        params: { offset, limit }
      });

      runInAction(() => {
        this.products = products;
      });
    } catch (err) {
      await rootStore.errorHandler(err, 'FetchCart');
    }
  }

  @action
  async insertCartProduct(productId: number) {
    try {
      await axiosCart.post('/insert_product', { productId });
      await this.fetchShoppingCart();
    } catch (err) {
      await rootStore.errorHandler(err, 'InsertProduct');
    }
  }

  @action
  async excludeCartProduct(productId: number) {
    try {
      await axiosCart.delete(`/exclude_product/${productId}`);
      await this.fetchShoppingCart();
    } catch (err) {
      await rootStore.errorHandler(err, 'ExcludeProduct');
    }
  }
}

export default new CartStore();
