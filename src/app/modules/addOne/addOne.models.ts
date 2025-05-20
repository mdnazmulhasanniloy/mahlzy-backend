import { model, Schema, Types } from 'mongoose';
import { IAddOne, IAddOneModules } from './addOne.interface';

const addOneSchema = new Schema<IAddOne>(
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

addOneSchema.statics.findByName = async (name: string) => {
  return await AddOne.findOne({ name: name });
};

const AddOne = model<IAddOne, IAddOneModules>('AddOne', addOneSchema);
export default AddOne;
