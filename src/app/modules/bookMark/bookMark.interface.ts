import { ObjectId } from 'mongoose';
import { Model } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IShop } from '../shop/shop.interface';

export interface IBookMark {
  _id: string;
  user: ObjectId | IUser;
  shop: ObjectId | IShop;
}

export interface IBookMarkModules
  extends Model<IBookMark, Record<string, unknown>> {
  isBookMarkExist(user: string, reference: string): Promise<IBookMark>;
}
