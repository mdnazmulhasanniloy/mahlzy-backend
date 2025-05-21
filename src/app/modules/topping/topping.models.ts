import { model, Schema, Types } from 'mongoose';
import { ITopping, IToppingModules } from './topping.interface';

const toppingSchema = new Schema<ITopping>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Topping = model<ITopping, IToppingModules>('Topping', toppingSchema);
export default Topping;
