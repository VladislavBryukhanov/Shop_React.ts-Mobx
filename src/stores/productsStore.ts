import axios from 'axios';
import { action, observable, runInAction } from 'mobx';
import { IProductList } from '../types/product';
import rootStore from './rootStore';
import { IPagingQuery } from '../types/pagingQuery';

const axiosProduct = axios.create({
  baseURL: `${process.env.REACT_APP_CORE_API}/products`,
  withCredentials: true
});

export class ProductsStore {
  @observable
  products: IProductList = {
    rows: [],
    count: 0
  };

  @action
  async fetchTopProducts(query: IPagingQuery) {
    const { currentPage, limit, searchQuery } = query;
    const offset = (currentPage - 1) * limit;
    const params = {
      offset,
      limit,
      searchQuery,
    };

    try {
      const { data: products } = await axiosProduct.get(`/top_products`, { params });
      runInAction(() => {
        this.products = products;
      });
    } catch (err) {
      await rootStore.errorHandler(err, 'FetchProducts');
    }
  }
  
  @action
  async fetchProducts(query: IPagingQuery, category: string) {
    const { currentPage, limit, searchQuery } = query;
    const offset = (currentPage - 1) * limit;
    const params = {
      category,
      offset,
      limit,
      searchQuery,
    };

    try {
      const { data: products } = await axiosProduct.get(`/products`, { params });
      runInAction(() => {
        this.products = products;
      });
    } catch (err) {
      await rootStore.errorHandler(err, 'FetchProducts');
    }
  }

  //TODO create, update, delete locally without second data fetching
  @action
  async createProduct(product: FormData) {
    try {
      await axiosProduct.post('/create_products', product);
      runInAction(() => {
        this.products = {
          ...this.products,
          count: this.products.count + 1
        }
      })
    } catch (err) {
      await rootStore.errorHandler(err, 'CreateProduct');
    }
  }
  
  @action
  async updateProduct(product: FormData) {
    try {
      await axiosProduct.put('/update_product', product)
    } catch (err) {
      await rootStore.errorHandler(err, 'UpdateProduct');
    }
  }
  
  @action
  async deleteProductById(id: number) {
    try {
      await axiosProduct.delete(`/delete_product/${id}`);
      runInAction(() => {
        this.products = {
          ...this.products,
          count: this.products.count - 1
        }
      })
    } catch (err) {
      await rootStore.errorHandler(err, 'DeleteProduct');
    }
  }
}

export default new ProductsStore();