import { Model, ObjectId } from 'mongoose';

export interface IOpeningTime {
  shop: ObjectId | string;
  day: string;
  openTime: string;
  closeTime: string;
}

export type IOpeningTimeModules = Model<IOpeningTime, Record<string, unknown>>;
