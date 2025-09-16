import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IOrders } from '../orders/orders.interface';
import { ICampaign } from '../campaign/campaign.interface';

export enum PAYMENT_MODEL_TYPE {
  Orders = 'Orders',
  Campaign = 'Campaign',
}
export interface IPayments {
  _id: string;
  device: 'web' | 'mobile';
  id: string;
  user: ObjectId | IUser;
  modelType: PAYMENT_MODEL_TYPE;
  reference: ObjectId | IOrders | ICampaign;
  author: ObjectId | IUser; 
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
