import { model, Schema } from 'mongoose';
import { ICouponCode, ICouponCodeModules } from './couponCode.interface';
import generateCryptoString from '../../utils/generateCryptoString';

const couponCodeSchema = new Schema<ICouponCode>(
  {
    resturant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title:{
      type: String,
      required: true,
    },
    discountType:{
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    code: {
      type: String, 
      default: () => generateCryptoString(10),
    },
    expiredAt: {
      type: String,
      required: true,
    },
    isActive: { type: Boolean, default: true },
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

couponCodeSchema.statics.findByCode = async (code: string) => {
  return CouponCode.findOne({ code: code });
};

const CouponCode = model<ICouponCode, ICouponCodeModules>(
  'CouponCode',
  couponCodeSchema,
);
export default CouponCode;
