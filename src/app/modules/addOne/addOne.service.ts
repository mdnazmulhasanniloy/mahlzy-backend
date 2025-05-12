import httpStatus from 'http-status';
import { IAddOne } from './addOne.interface';
import AddOne from './addOne.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { uploadToS3 } from '../../utils/s3'; 

const createAddOne = async (payload: IAddOne, file: any) => {
  if (file) {
    payload.image = (await uploadToS3({
      file: file,
      fileName: `images/add_one/${Math.floor(100000 + Math.random() * 900000)}`,
    })) as string;
  }
  const result = await AddOne.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create addOne');
  }
  return result;
};

const getAllAddOne = async (query: Record<string, any>) => {
  const addOneModel = new QueryBuilder(AddOne.find({ isDeleted: false }), query)
    .search(['name'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await addOneModel.modelQuery;
  const meta = await addOneModel.countTotal();

  return {
    data,
    meta,
  };
};

const getAddOneById = async (id: string) => {
  const result = await AddOne.findById(id);
  if (!result || result?.isDeleted) {
    throw new Error('AddOne not found!');
  }
  return result;
};

const updateAddOne = async (
  id: string,
  payload: Partial<IAddOne>,
  file: any,
) => {
  if (file) {
    payload.image = (await uploadToS3({
      file: file,
      fileName: `images/add_one/${Math.floor(100000 + Math.random() * 900000)}`,
    })) as string;
  }
  const result = await AddOne.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Failed to update AddOne');
  }
  return result;
};

const deleteAddOne = async (id: string) => {
  const result = await AddOne.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete addOne');
  }
  return result;
};

export const addOneService = {
  createAddOne,
  getAllAddOne,
  getAddOneById,
  updateAddOne,
  deleteAddOne,
};
