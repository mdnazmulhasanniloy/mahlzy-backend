import { Model, ObjectId } from 'mongoose';

export interface ITopping {
  name: string;
  price: number;
  category: ObjectId;
  author: ObjectId;
  description: string;
  image: string;
  isDeleted: boolean;
}

export type IToppingModules = Model<ITopping, Record<string, unknown>>;
