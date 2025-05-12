import { Model, ObjectId } from 'mongoose';

export interface ICuisines {
  _id: string | ObjectId;
  name: string;
  image: string;
  isDeleted: boolean;
}

export interface ICuisinesModules
  extends Model<ICuisines, Record<string, unknown>> {
  findByName(name: string): Promise<ICuisines>;
}
