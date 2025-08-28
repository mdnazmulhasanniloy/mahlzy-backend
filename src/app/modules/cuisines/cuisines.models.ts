import { model, Schema, Types } from 'mongoose';
import { ICuisines, ICuisinesModules } from './cuisines.interface';

const cuisinesSchema = new Schema<ICuisines>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    }, 
    shop: {
      type: Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

cuisinesSchema.statics.findByName = (name: string) => {
  return Cuisines.findOne({ name: name });
};
const Cuisines = model<ICuisines, ICuisinesModules>('Cuisines', cuisinesSchema);
export default Cuisines;
