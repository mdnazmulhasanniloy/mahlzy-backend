import httpStatus from 'http-status';
import { IMarketing } from './marketing.interface';
import Marketing from './marketing.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import Shop from '../shop/shop.models'; 
import moment from 'moment';
import Contents from '../contents/contents.models';

const createMarketing = async (payload: IMarketing) => {
  if (payload.user) {
    const shop = await Shop.findOne({ author: payload.user });
    if (!shop) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Shop not found for the user');
    }
    //@ts-ignore
    payload.shop = shop._id.toString();
  }
  payload.duration = moment(payload.endAt).diff(
    moment(payload.startAt),
    'days',
  );

  const amountPerDay = await Contents.findOne({}).then(
    content => content?.marketingPrice,
  );

  if (!amountPerDay) {
    console.log('Create Marketing Error: amount per day not found!');
    throw new AppError(httpStatus.BAD_REQUEST, 'Server internal error!');
  }

  payload.amount = Number(
    (Number(amountPerDay) * Number(payload.duration)).toFixed(2),
  );
  const result = await Marketing.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create marketing');
  }
  return result;
};

const getAllMarketing = async (query: Record<string, any>) => {
  const marketingModel = new QueryBuilder(
    Marketing.find({ isDeleted: false }),
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await marketingModel.modelQuery;
  const meta = await marketingModel.countTotal();

  return {
    data,
    meta,
  };
};

const getMarketingById = async (id: string) => {
  const result = await Marketing.findById(id);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Marketing not found!');
  }
  return result;
};

const updateMarketing = async (id: string, payload: Partial<IMarketing>) => {
  const result = await Marketing.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Marketing');
  }
  return result;
};

const deleteMarketing = async (id: string) => {
  const result = await Marketing.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete marketing');
  }
  return result;
};

export const marketingService = {
  createMarketing,
  getAllMarketing,
  getMarketingById,
  updateMarketing,
  deleteMarketing,
};
