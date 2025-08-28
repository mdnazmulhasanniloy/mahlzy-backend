import { model, Schema, Types } from 'mongoose';
import { IOpeningTime, IOpeningTimeModules } from './openingTime.interface';

const openingTimeSchema = new Schema<IOpeningTime>(
  {
    shop: {
      type: Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    day: {
      type: String,
      enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      required: [true, 'Day is required'],
    },
    openTime: {
      type: String,
      required: [true, 'Open time is required'],
    },
    closeTime: {
      type: String,
      required: [true, 'Close time is required'],
    },
  },
  {
    timestamps: true,
  },
);

const OpeningTime = model<IOpeningTime, IOpeningTimeModules>(
  'OpeningTime',
  openingTimeSchema,
);
export default OpeningTime;
