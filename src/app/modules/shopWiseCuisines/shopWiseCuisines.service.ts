import httpStatus from 'http-status';
import { IShopWiseCuisines } from './shopWiseCuisines.interface';
import ShopWiseCuisines from './shopWiseCuisines.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createShopWiseCuisines = async (payload: IShopWiseCuisines) => {
  const result = await ShopWiseCuisines.create(payload);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create shopWiseCuisines',
    );
  }
  return result;
};

const getAllShopWiseCuisines = async (query: Record<string, any>) => {
  query[''] = false;
  const shopWiseCuisinesModel = new QueryBuilder(ShopWiseCuisines.find(), query)
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await shopWiseCuisinesModel.modelQuery;
  const meta = await shopWiseCuisinesModel.countTotal();

  return {
    data,
    meta,
  };
};

const getShopWiseCuisinesById = async (id: string) => {
  const result = await ShopWiseCuisines.findById(id);
  if (!result) {
    throw new Error('ShopWiseCuisines not found!');
  }
  return result;
};

const updateShopWiseCuisines = async (
  id: string,
  payload: Partial<IShopWiseCuisines>,
) => {
  const result = await ShopWiseCuisines.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new Error('Failed to update ShopWiseCuisines');
  }
  return result;
};

const deleteShopWiseCuisines = async (id: string) => {
  const result = await ShopWiseCuisines.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete shopWiseCuisines',
    );
  }
  return result;
};

export const shopWiseCuisinesService = {
  createShopWiseCuisines,
  getAllShopWiseCuisines,
  getShopWiseCuisinesById,
  updateShopWiseCuisines,
  deleteShopWiseCuisines,
};
