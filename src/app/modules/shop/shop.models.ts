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
    totalSales: {
      type: Number,
      default: 0,
    },
    marketingEx:{
      type:Date,
      default:null
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

shopSchema.index({ shopLocation: '2dsphere' });
shopSchema.index({ totalSales: 1 });
shopSchema.index({ author: 1 });

shopSchema.statics.isShopExistId = async function (id: string) {
  return await Shop.findById(id);
};
shopSchema.statics.getShopByAuthor = async function (author: string) {
  return await Shop.findOne({ author: author }).populate([
    { path: 'reviews' },
    { path: 'categories' },
    { path: 'author', select: 'name email phoneNumber profile' },
  ]);
};

const Shop = model<IShop, IShopModules>('Shop', shopSchema);
export default Shop;
