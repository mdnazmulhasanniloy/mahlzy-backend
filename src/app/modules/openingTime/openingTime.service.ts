import httpStatus from 'http-status';
import { IOpeningTime } from './openingTime.interface';
import OpeningTime from './openingTime.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { User } from '../user/user.models';

const createOpeningTime = async (payload: IOpeningTime, userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.BAD_REQUEST, 'user not found');
  //@ts-ignore
  payload.shop = user.shop;
  const result = await OpeningTime.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create openingTime');
  }
  return result;
};

const getAllOpeningTime = async (query: Record<string, any>) => {
  const openingTimeModel = new QueryBuilder(OpeningTime.find(), query)
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await openingTimeModel.modelQuery;
  const meta = await openingTimeModel.countTotal();

  return {
    data,
    meta,
  };
};

const getOpeningTimeById = async (id: string) => {
  const result = await OpeningTime.findById(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OpeningTime not found!');
  }
  return result;
};

const updateOpeningTime = async (
  id: string,
  payload: Partial<IOpeningTime>,
) => {
  const result = await OpeningTime.findByIdAndUpdate(id, payload, {
    new: true,
  }); 
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update OpeningTime');
  }
  return result;
};

const deleteOpeningTime = async (id: string) => {
  const result = await OpeningTime.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete openingTime');
  }
  return result;
};

export const openingTimeService = {
  createOpeningTime,
  getAllOpeningTime,
  getOpeningTimeById,
  updateOpeningTime,
  deleteOpeningTime,
};
