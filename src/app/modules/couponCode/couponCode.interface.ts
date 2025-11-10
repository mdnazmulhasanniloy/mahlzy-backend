import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';

export interface ICouponCode {
  resturant: ObjectId | IUser;
  title: string;
  code: string;
  discountType: string;
  expiredAt: string;
  isActive: boolean;
  discount: number;
  isDeleted: boolean;
}

export interface ICouponCodeModules
  extends Model<ICouponCode, Record<string, unknown>> {
  findByCode(code: string): Promise<ICouponCode>;
}
