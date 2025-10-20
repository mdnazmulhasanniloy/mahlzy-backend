import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
import { ITopping } from '../topping/topping.interface';
import { IProducts } from '../products/products.interface';

export interface IOrders {
  createdAt: Date;
  id: string;
  user: ObjectId | IUser;
  author: ObjectId | IUser;
  totalPrice: number;
  coupon: string;
  status: string;
  paymentStatus: string;
  trnId: string;
  adminPercentage: number;
  resturantPercentage: number;
  comment: string;
  orderItems: {
    product: ObjectId | IProducts;
    quantity: number;
    price: number;
    additionalDetails: string;
  }[];
  additionalItems: {
    topping: ObjectId | ITopping;
    quantity: number;
    price: number;
  }[];

  deliveryMan: ObjectId | IUser;
  deliveryLocation: {
    type: 'Point';
    coordinates: [number, number];
  };
  billingDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  isDeleted: boolean;
}

export type IOrdersModules = Model<IOrders, Record<string, unknown>>;
