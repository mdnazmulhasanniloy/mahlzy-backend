import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IOrders } from '../orders/orders.interface';

export interface IPayments {
  _id: string;
  id: string;
  user: ObjectId | IUser;
  author: ObjectId | IUser;
  order: ObjectId | IOrders;
  amount: Number;
  status: 'paid' | 'pending' | 'cancel' | 'refound';
  isTransfer: boolean;
  tranId: string;
  paymentIntentId: string;
  adminAmount: number;
  transferAt: Date;
  isDeleted: boolean;
}

export type IPaymentsModules = Model<IPayments, Record<string, unknown>>;
