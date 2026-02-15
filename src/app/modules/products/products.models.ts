import { model, Schema, Types } from 'mongoose';
import { IProducts, IProductsModules } from './products.interface';
import generateCryptoString from '../../utils/generateCryptoString';

const productsSchema = new Schema<IProducts>(
  {
    id: {
      type: String,
      default: () => generateCryptoString(8),
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    shortDescriptions: {
      type: String,
      required: [true, 'Short description is required'],
    },
    descriptions: {
      type: String,
      required: [true, 'Description is required'],
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    shop: {
      type: Types.ObjectId,
      ref: 'Shop',
      required: [true, 'Shop is required'],
    },
    cuisines: {
      type: Types.ObjectId,
      ref: 'Cuisines',
      required: [true, 'Cuisines is required'],
    },
    spiceLevel: {
      type: String,
      required: [true, 'Spice level is required'],
      // enum: {
      //   values: ["mild", "medium", "hot"],
      //   message: "Spice level must be one of 'mild', 'medium', or 'hot'",
      // },
    },
    sauceLevel: {
      type: String,
      required: [true, 'Sauce level is required'],
      // enum: {
      //   values: ["light", "moderate", "extra"],
      //   message: "Sauce level must be one of 'light', 'moderate', or 'extra'",
      // },
    },
    allergyInfo: {
      type: String,
      required: [true, 'Sauce level is required'],
      // enum: {
      //   values: ["light", "moderate", "extra"],
      //   message: "Sauce level must be one of 'light', 'moderate', or 'extra'",
      // },
    },
    primaryOptions: [
      {
        filed: {
          type: String,
          required: [true, 'primary options filed is required'],
        },
        price: {
          type: Number,
          required: [true, 'primary options price is required'],
        },
      },
    ],
    toppings: {
      type: [Types.ObjectId],
      ref: 'Topping',
      required: [true, 'Toppings are required'],
      validate: {
        validator: (value: any) => Array.isArray(value) && value.length > 0,
        message: 'At least one topping is required',
      },
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100'],
    },
    images: {
      type: [
        {
          url: { type: String, required: [true, 'Image URL is required'] },
          key: { type: String, required: [true, 'Image key is required'] },
        },
      ],
    },

    totalSell: {
      type: Number,
      default: 0,
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

productsSchema.index({ price: 1 });
productsSchema.index({ cuisines: 1 });
productsSchema.index({ shop: 1 });
productsSchema.index({ name: 'text' });
productsSchema.index({ id: 1 }, { unique: true });
productsSchema.statics.findByProductId = async function (id: string) {
  return await this.findOne({ id });
};
const Products = model<IProducts, IProductsModules>('Products', productsSchema);
export default Products;
