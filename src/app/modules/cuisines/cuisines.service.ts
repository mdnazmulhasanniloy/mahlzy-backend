import httpStatus from 'http-status';
import { ICuisines } from './cuisines.interface';
import Cuisines from './cuisines.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { uploadToS3 } from '../../utils/s3';
import generateCryptoString from '../../utils/generateCryptoString';

const createCuisines = async (payload: ICuisines, file: any) => {
  if (file) {
    payload.image = (await uploadToS3({
      file: file,
      fileName: generateCryptoString(6),
    })) as string;
  }

  const isExist = await Cuisines.findByName(payload?.name);
  if (isExist) {
    const result = await Cuisines.findByIdAndUpdate(isExist?._id, payload, {
      new: true,
    });
    return result;
  }
  const result = await Cuisines.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create cuisines');
  }
  return result;
};

const getAllCuisines = async (query: Record<string, any>) => {
  const cuisinesModel = new QueryBuilder(
    Cuisines.find({ isDeleted: false }),
    query,
  )
    .search(['name'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await cuisinesModel.modelQuery;
  const meta = await cuisinesModel.countTotal();

  return {
    data,
    meta,
  };
};

const getCuisinesById = async (id: string) => {
  const result = await Cuisines.findById(id);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cuisines not found!');
  }
  return result;
};

const updateCuisines = async (
  id: string,
  payload: Partial<ICuisines>,
  file: any,
) => {
  if (file) {
    payload.image = (await uploadToS3({
      file: file,
      fileName: generateCryptoString(6),
    })) as string;
  }
  const result = await Cuisines.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Cuisines');
  }
  return result;
};

const deleteCuisines = async (id: string) => {
  const result = await Cuisines.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete cuisines');
  }
  return result;
};

export const cuisinesService = {
  createCuisines,
  getAllCuisines,
  getCuisinesById,
  updateCuisines,
  deleteCuisines,
};
