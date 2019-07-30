import { ICategory } from './category';

export interface IProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
  previewPhoto: string;
  OrderCount: number;
  CategoryId?: number;
  Category: ICategory;
}

export interface IProductList {
  rows: IProduct[];
  count: number;
}