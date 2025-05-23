import { model, Schema, Types } from 'mongoose';
import { IProducts, IProductsModules } from './products.interface';

const productsSchema = new Schema<IProducts>(
  {
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
    category: {
      type: Types.ObjectId,
      ref: 'Categories',
      required: [true, 'Category is required'],
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
    totalReview: {
      type: Number,
      default: 0,
      min: [0, 'Total reviews cannot be negative'],
    },
    avgRatings: {
      type: Number,
      default: 0,
      min: [0, 'Average rating cannot be negative'],
      max: [5, 'Average rating cannot exceed 5'],
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

const Products = model<IProducts, IProductsModules>('Products', productsSchema);
export default Products;
