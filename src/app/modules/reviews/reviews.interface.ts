import { Model, ObjectId } from 'mongoose';

 
export interface IReviews {
  _id?: string;
  user: ObjectId;
  shop: ObjectId;
  review: string;
  rating: number;
}

export type IReviewsModules = Model<IReviews, Record<string, unknown>>;
