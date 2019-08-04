import { IProduct } from './product';

export interface IOrder {
  id: number;
  products: IProduct[];
  createdAt: string;
}