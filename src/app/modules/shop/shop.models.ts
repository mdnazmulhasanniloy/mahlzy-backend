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
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
        required: true,
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
        required: true,
      },
    ],
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

    shopName: {
      type: String,
      required: [true, 'shopName is required'],
      unique: true,
    },
    avgRating: {
      type: Number,
      required: [false, 'Name is required'],
    },

    banner: {
      type: String,
      default: null,
    },
    profile: {
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
    totalSeals: {
      type: Number,
      default: 0,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

shopSchema.index({ shopLocation: '2dsphere' });
shopSchema.index({ totalSeals: 1 });
shopSchema.index({ author: 1 });

shopSchema.statics.isShopExistId = async function (id: string) {
  return await Shop.findById(id);
};
shopSchema.statics.getShopByAuthor = async function (author: string) {
  return await Shop.findOne({ author: author });
};

const Shop = model<IShop, IShopModules>('Shop', shopSchema);
export default Shop;
