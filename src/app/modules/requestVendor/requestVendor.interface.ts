import { Model } from 'mongoose';

export interface IRequestVendor {
  businessName: string;
  image: string;
  userName: string;
  businessEmail: string;
  phoneNumber: string;
  businessAddress: string;
}

export type IRequestVendorModules = Model<
  IRequestVendor,
  Record<string, unknown>
>;
