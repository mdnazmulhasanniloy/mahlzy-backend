import { Model, ObjectId } from 'mongoose';
import { IProducts } from '../products/products.interface';

export interface IOptions {
  name: String;
  value: string;
  price: string;
}
export interface IAttribute {
  product: ObjectId | IProducts;
  type: 'input' | 'number' | 'radio' | 'select';
  title: string;
  isRequired: boolean;
  placeholder: string;
  options: IOptions[];
  isDeleted: boolean;
}

export type IAttributeModules = Model<IAttribute, Record<string, unknown>>;
