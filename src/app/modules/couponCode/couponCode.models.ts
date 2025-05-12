import { model, Schema, Types } from 'mongoose';
import { ICouponCode, ICouponCodeModules } from './couponCode.interface';
import generateCryptoString from '../../utils/generateCryptoString';

const couponCodeSchema = new Schema<ICouponCode>(
  {
    resturant: {
      types: Types.ObjectId,
      ref: '',
    },
    code: {
      type: String,
      default: () => generateCryptoString(10),
    },
    expiredAt: {
      type: String,
      required: true,
    },
    isActive: { type: Boolean, default: false },
    discount: {
      type: Number,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const CouponCode = model<ICouponCode, ICouponCodeModules>(
  'CouponCode',
  couponCodeSchema,
);
export default CouponCode;
