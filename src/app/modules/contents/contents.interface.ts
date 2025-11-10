import { Model, ObjectId } from 'mongoose';

export interface IContents {
  deleteKey?: string[];
  _id?: string; 
  aboutUs?: string;
  marketingPrice: number;
  termsAndConditions?: string;
  banner: { key: string; url: string }[];
  privacyPolicy?: string;
  isDeleted?: boolean;
}

export type IContentsModel = Model<IContents, Record<string, unknown>>;
