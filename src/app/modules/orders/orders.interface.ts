import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
import { ITopping } from '../topping/topping.interface';
import { IProducts } from '../products/products.interface';

export interface IOrders {
  id: string;
  user: ObjectId;
  author: ObjectId;
  totalPrice: number;
  coupon: string;
  status: string;
  paymentStatus: string;
  trnId: string;
  orderItems: {
    product: ObjectId | IProducts;
    quantity: number;
    price: number;
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
