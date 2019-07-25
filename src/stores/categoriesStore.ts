import { action, observable, runInAction } from 'mobx';
import { ICategory } from '../types/category';

import axios from 'axios';
import rootStore from './rootStore';
const axiosCategory = axios.create({
  baseURL: `${process.env.REACT_APP_CORE_API}/categories`,
  withCredentials: true
});

export class CategoriesStore {
  @observable
  categories: ICategory[] = [];

  @action
  async fetchCategories() {
    try {
      const { data: categories } = await axiosCategory.get('/fetch_categories');
      runInAction(() => {
        this.categories = categories;
      });
    } catch (err) {
      await rootStore.errorHandler(err, 'FetchCategories');
    }
  }

  @action
  async createCategory(categoryName: string) {
    try {
      const { data: resCategory } = await axiosCategory.post(
        '/create_category', { categoryName });
      runInAction(() => {
        this.categories.push(resCategory);
      })
    } catch (err) {
      await rootStore.errorHandler(err, 'CreateCategory');
    }
  }

  @action
  async removeCategory(categoryId: number) {
    try {
      await axiosCategory.delete(`/remove_category/${categoryId}`);
      runInAction(() => {
        const index = this.categories.findIndex(({ id }) => id === categoryId);
        this.categories.splice(index, 1);
      })
    } catch (err) {
      await rootStore.errorHandler(err, 'RemoveCategory');
    }
  }
}

export default new CategoriesStore();
