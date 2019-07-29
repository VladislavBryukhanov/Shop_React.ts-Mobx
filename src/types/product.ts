import { ICategory } from './category';

export interface IProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
  previewPhoto: string;
  category: ICategory;
}

export interface IProductList {
  rows: IProduct[];
  count: number;
}