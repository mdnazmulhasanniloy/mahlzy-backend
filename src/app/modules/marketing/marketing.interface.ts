import { Model, ObjectId } from 'mongoose';
import { IShop } from '../shop/shop.interface';

export interface IMarketing {
  user: ObjectId | String;
  shop: ObjectId | IShop;
  startAt: Date;
  isPaid: boolean;
  endAt: Date;
  duration: number;
  amount: number;
  isDeleted: boolean;
}

export type IMarketingModules = Model<IMarketing, Record<string, unknown>>;
