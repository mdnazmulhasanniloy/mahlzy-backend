import { model, Schema, Types } from 'mongoose';
import { IMarketing, IMarketingModules } from './marketing.interface';

const marketingSchema = new Schema<IMarketing>(
  {
    shop: {
      type: Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    endAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Marketing = model<IMarketing, IMarketingModules>(
  'Marketing',
  marketingSchema,
);
export default Marketing;
