import { Model, Types } from 'mongoose';
import { IShop } from '../shop/shop.interface';
import { IDeliveryMan } from '../deliveryMan/deliveryMan.interface';
interface ILocation {
  type: string;
  coordinates: [number, number];
}
export interface IUser {
  _id?: Types.ObjectId;
  status: string;
  username: string;
  name: string;
  deliveryMan?: string | IDeliveryMan;
  shop?: string | IShop;
  email: string;
  phoneNumber: string;
  password: string;
  gender: 'Male' | 'Female' | 'Others';
  location: ILocation;
  profile: string;
  role: string;
  isGoogleLogin: boolean;
  address?: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  isDeleted: boolean;
  loginWth: 'google' | 'apple' | 'facebook' | 'credentials';
  verification: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
  device: {
    ip: string;
    browser: string;
    os: string;
    device: string;
    lastLogin: string;
  };
}

export interface UserModel extends Model<IUser> {
  isUserExist(email: string): Promise<IUser>;
  IsUserExistId(id: string): Promise<IUser>;
  IsUserExistUserName(userName: string): Promise<IUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
