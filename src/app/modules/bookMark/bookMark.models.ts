import { model, Schema, Types } from 'mongoose';
import { IBookMark, IBookMarkModules } from './bookMark.interface';

const bookMarkSchema = new Schema<IBookMark>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

bookMarkSchema.statics.isBookMarkExist = async function (
  user: string,
  shop: string,
) {
  return await BookMark.findOne({ user, shop });
};

const BookMark = model<IBookMark, IBookMarkModules>('BookMark', bookMarkSchema);
export default BookMark;
