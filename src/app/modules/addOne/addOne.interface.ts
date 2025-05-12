import { Model, ObjectId } from 'mongoose';

export interface IAddOne {
  name: string;
  price: number;
  category: ObjectId;
  author: ObjectId;
  description: string;
  image: string;
  isDeleted: boolean;
}

export interface IAddOneModules
  extends Model<IAddOne, Record<string, unknown>> {
  findByName(name: string): Promise<IAddOne>;
}
