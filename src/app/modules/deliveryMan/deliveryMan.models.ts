import { model, Schema } from 'mongoose';
import { IDeliveryMan, IDeliveryManModules } from './deliveryMan.interface';
import generateCryptoString from '../../utils/generateCryptoString';

const deliveryManSchema = new Schema<IDeliveryMan>(
  {
    id: {
      type: String,
      default: () => generateCryptoString(10),
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true, 
    },
    vehicleType: {
      type: String,
      default: null,
    },
    availability_status: {
      type: Boolean,
      default: false,
    },
    total_delivery: {
      type: Number,
      default: 0,
    },
    avg_rating: {
      type: Number,
      default: 0,
    },
    lastLocation: {
      type: {
        type: {
          type: String,
          default: 'Point',
        },
        coordinates: [Number],
      },
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const DeliveryMan = model<IDeliveryMan, IDeliveryManModules>(
  'DeliveryMan',
  deliveryManSchema,
);
export default DeliveryMan;
