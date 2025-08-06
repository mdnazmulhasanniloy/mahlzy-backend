import { Model, ObjectId } from 'mongoose';
import { IShop } from '../shop/shop.interface';

export interface ICampaign {
  shop: ObjectId | IShop;
  banner: string;
  expireAt: string | Date;
  discount: number;
}

export type ICampaignModules = Model<ICampaign, Record<string, unknown>>;
