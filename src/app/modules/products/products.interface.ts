import { Model, ObjectId } from 'mongoose';

interface IImages {
  key: string;
  url: string;
}
interface subOptions {
  filed: string;
  price: number;
}
export interface IProducts {
  deleteKey: string[];
  _id: string;
  id: string;
  name: string;
  price: number;
  shortDescriptions: string;
  descriptions: string;
  author: ObjectId;
  shop: ObjectId;
  cuisines: ObjectId;
  spiceLevel: string;
  sauceLevel: string;
  toppings: ObjectId[];
  discount: number;
  images: IImages[];
  primaryOptions: subOptions[];
  allergyInfo: string;
  totalSell: number;
  isDeleted: boolean;
}

export interface IProductsModules
  extends Model<IProducts, Record<string, unknown>> {
  findByProductId(id: string): Promise<IProducts>;
}
