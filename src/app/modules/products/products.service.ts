
import httpStatus from 'http-status';
import { IProducts } from './products.interface';
import Products from './products.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createProducts = async (payload: IProducts) => {
  const result = await Products.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create products');
  }
  return result;
};

const getAllProducts = async (query: Record<string, any>) => {
query[""] = false;
  const productsModel = new QueryBuilder(Products.find({isDeleted:false}), query)
    .search([""])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await productsModel.modelQuery;
  const meta = await productsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getProductsById = async (id: string) => {
  const result = await Products.findById(id);
  if (!result || result?.isDeleted) {
    throw new Error('Products not found!');
  }
  return result;
};

const updateProducts = async (id: string, payload: Partial<IProducts>) => {
  const result = await Products.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Failed to update Products');
  }
  return result;
};

const deleteProducts = async (id: string) => {
  const result = await Products.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete products');
  }
  return result;
};

export const productsService = {
  createProducts,
  getAllProducts,
  getProductsById,
  updateProducts,
  deleteProducts,
};