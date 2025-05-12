import { model, Schema, Types } from 'mongoose';
import {
  IShopWiseCuisines,
  IShopWiseCuisinesModules,
} from './shopWiseCuisines.interface';

const shopWiseCuisinesSchema = new Schema<IShopWiseCuisines>(
  {
    shop: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cuisines: {
      type: Types.ObjectId,
      ref: 'Cuisines',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ShopWiseCuisines = model<IShopWiseCuisines, IShopWiseCuisinesModules>(
  'ShopWiseCuisines',
  shopWiseCuisinesSchema,
);
export default ShopWiseCuisines;
