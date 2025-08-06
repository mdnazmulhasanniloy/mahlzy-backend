import { Model, ObjectId } from 'mongoose';

export interface ILocation {
  type: 'Point';
  coordinates: [number, number];
}
export interface IOpeningTime {
  _id: string;
  day: string;
  openTime: string;
  closeTime: string;
}
export interface IShop {
  _id: string;
  id: string;
  author: ObjectId;
  categories: ObjectId[];
  reviews: ObjectId[];
  avgRating: number;
  totalSeals: number; 

  shopMail: string;
  profile: string;
  shopPhoneNumber: string;
  shopName: string;
  banner: string;
  bannerColor: string;
  deliveryType: 'pickup' | 'delivery' | 'booth';
  openingTime: IOpeningTime[];
  minDeliveryCharge: number;
  shopLocation: ILocation;
  isDeleted: boolean;
}

export interface IShopModules extends Model<IShop, Record<string, unknown>> {
  isShopExist(email: string): Promise<IShop>;
  getShopByAuthor(author: string): Promise<IShop>;
  isShopExistId(id: string): Promise<IShop>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
