import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
import { ICuisines } from '../cuisines/cuisines.interface';

export interface IShopWiseCuisines {
  shop: ObjectId | IUser;
  cuisines: ObjectId | ICuisines;
}

export type IShopWiseCuisinesModules = Model<
  IShopWiseCuisines,
  Record<string, unknown>
>;
