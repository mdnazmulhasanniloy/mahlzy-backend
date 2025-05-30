import { model, Schema } from 'mongoose';
import { IShop, IShopModules } from './shop.interface';
import generateCryptoString from '../../utils/generateCryptoString';
import generateRandomHexColor from '../../utils/generateRandomHexColor';

const shopSchema = new Schema<IShop>(
  {
    id: {
      type: String,
      default: () => generateCryptoString(6),
      unique: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shopMail: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'Email is required'],
      unique: true,
    },
    shopPhoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
    },
    deliveryFee:{
      type: Number,
      default:0
    },
    shopName: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
    },

    banner: {
      type: String,
      default: null,
    },

    bannerColor: {
      type: String,
      default: () => generateRandomHexColor(),
    },

    deliveryType: {
      type: String,
      enum: ['pickup', 'delivery', 'booth'],
      default: 'pickup',
    },

    openingTime: [
      {
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
    ],

    minDeliveryCharge: {
      type: Number,
      default: 0,
    },

    shopLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
    },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

shopSchema.statics.isShopExistId = async function (id: string) {
  return await Shop.findById(id);
};
shopSchema.statics.getShopByAuthor = async function (author: string) {
  return await Shop.findOne({author: author});
};

const Shop = model<IShop, IShopModules>('Shop', shopSchema);
export default Shop;
