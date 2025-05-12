import { model, Schema } from 'mongoose';
import {
  IRequestVendor,
  IRequestVendorModules,
} from './requestVendor.interface';

const requestVendorSchema = new Schema<IRequestVendor>(
  {
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
    },
    businessEmail: {
      type: String,
      required: [true, 'Business email is required'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Business phone number is required'],
    },
    businessAddress: {
      type: String,
      required: [true, 'Business address is required'],
    },
  },
  {
    timestamps: true,
  },
);

//requestVendorSchema.pre('find', function (next) {
//  //@ts-ignore
//  this.find({ isDeleted: { $ne: true } });
//  next();
//});

//requestVendorSchema.pre('findOne', function (next) {
//@ts-ignore
//this.find({ isDeleted: { $ne: true } });
// next();
//});

requestVendorSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const RequestVendor = model<IRequestVendor, IRequestVendorModules>(
  'RequestVendor',
  requestVendorSchema,
);
export default RequestVendor;
