import { Model, ObjectId } from 'mongoose';
import { IShop } from '../shop/shop.interface';

export interface ICuisines {
  _id: string | ObjectId;
  name: string; 
  shop: ObjectId | IShop;
  isDeleted: boolean;
}

export interface ICuisinesModules
  extends Model<ICuisines, Record<string, unknown>> {
  findByName(name: string): Promise<ICuisines>;
}
