
import httpStatus from 'http-status';
import { ITopping } from './topping.interface';
import Topping from './topping.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { uploadToS3 } from '../../utils/s3';

const createTopping = async (payload: ITopping, file:any ) => {
   if (file) {
    payload.image = (await uploadToS3({
      file: file,
      fileName: `images/toppings/${Math.floor(100000 + Math.random() * 900000)}`,
    })) as string;
  }
  const result = await Topping.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create topping');
  }
  return result;
};

const getAllTopping = async (query: Record<string, any>) => { 
  const toppingModel = new QueryBuilder(Topping.find({isDeleted:false}), query)
    .search(["name"])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await toppingModel.modelQuery;
  const meta = await toppingModel.countTotal();

  return {
    data,
    meta,
  };
};

const getToppingById = async (id: string) => {
  const result = await Topping.findById(id);
  if (!result || result?.isDeleted) {
    throw new Error('Topping not found!');
  }
  return result;
};

const updateTopping = async (id: string, payload: Partial<ITopping>, file:any) => {
  
   if (file) {
    payload.image = (await uploadToS3({
      file: file,
      fileName: `images/toppings/${Math.floor(100000 + Math.random() * 900000)}`,
    })) as string;
  }

  const result = await Topping.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Failed to update Topping');
  }
  return result;
};

const deleteTopping = async (id: string) => {
  const result = await Topping.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete topping');
  }
  return result;
};

export const toppingService = {
  createTopping,
  getAllTopping,
  getToppingById,
  updateTopping,
  deleteTopping,
};