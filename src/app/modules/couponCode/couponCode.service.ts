
import httpStatus from 'http-status';
import { ICouponCode } from './couponCode.interface';
import CouponCode from './couponCode.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createCouponCode = async (payload: ICouponCode) => {
  const result = await CouponCode.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create couponCode');
  }
  return result;
};

const getAllCouponCode = async (query: Record<string, any>) => {
query[""] = false;
  const couponCodeModel = new QueryBuilder(CouponCode.find({isDeleted:false}), query)
    .search([""])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await couponCodeModel.modelQuery;
  const meta = await couponCodeModel.countTotal();

  return {
    data,
    meta,
  };
};

const getCouponCodeById = async (id: string) => {
  const result = await CouponCode.findById(id);
  if (!result || result?.isDeleted) {
    throw new Error('CouponCode not found!');
  }
  return result;
};

const updateCouponCode = async (id: string, payload: Partial<ICouponCode>) => {
  const result = await CouponCode.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Failed to update CouponCode');
  }
  return result;
};

const deleteCouponCode = async (id: string) => {
  const result = await CouponCode.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete couponCode');
  }
  return result;
};

export const couponCodeService = {
  createCouponCode,
  getAllCouponCode,
  getCouponCodeById,
  updateCouponCode,
  deleteCouponCode,
};