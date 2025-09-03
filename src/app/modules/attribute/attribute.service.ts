import { query } from 'express';
import httpStatus from 'http-status';
import { IAttribute } from './attribute.interface';
import Attribute from './attribute.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import Products from '../products/products.models';

const createAttribute = async (payload: IAttribute) => {
  const result = await Attribute.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create attribute');
  }
  return result;
};

const getAllAttribute = async (query: Record<string, any>) => {
  // const result = Attribute.find({ product: query.product });
  // return result;
  const attributeModel = new QueryBuilder(
    Attribute.find({ isDeleted: false }),
    query,
  )
    .search(['title'])
    .filter()
    .paginate()
    .sort()
    .fields();
  const data = await attributeModel.modelQuery;
  const meta = await attributeModel.countTotal();

  return {
    data,
    meta,
  };
};

const getAttributeById = async (id: string) => {
  const result = await Attribute.findById(id).populate('product');
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Attribute not found!');
  }
  return result;
};

const updateAttribute = async (id: string, payload: Partial<IAttribute>) => {
  const result = await Attribute.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Attribute');
  }
  return result;
};

const deleteAttribute = async (id: string) => {
  const result = await Attribute.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete attribute');
  }
  return result;
};

export const attributeService = {
  createAttribute,
  getAllAttribute,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
};
