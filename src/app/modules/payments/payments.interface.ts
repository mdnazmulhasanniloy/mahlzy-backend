import { Model, ObjectId } from 'mongoose';

export interface IPayments {
  id: string;
  user: ObjectId;
  author: ObjectId;
  order: ObjectId;
  amount: Number;
  status: 'paid' | 'pending' | 'cancel' | 'refound';
  isTransfer: boolean;
  tranId: string;
  chId: string;
  transferAt: Date;
  isDeleted: boolean;
}

export type IPaymentsModules = Model<IPayments, Record<string, unknown>>;
