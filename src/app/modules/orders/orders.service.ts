
import httpStatus from 'http-status';
import { IOrders } from './orders.interface';
import Orders from './orders.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createOrders = async (payload: IOrders) => {
  const result = await Orders.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create orders');
  }
  return result;
};

const getAllOrders = async (query: Record<string, any>) => {
query[""] = false;
  const ordersModel = new QueryBuilder(Orders.find({isDeleted:false}), query)
    .search([""])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await ordersModel.modelQuery;
  const meta = await ordersModel.countTotal();

  return {
    data,
    meta,
  };
};

const getOrdersById = async (id: string) => {
  const result = await Orders.findById(id);
  if (!result || result?.isDeleted) {
    throw new Error('Orders not found!');
  }
  return result;
};

const updateOrders = async (id: string, payload: Partial<IOrders>) => {
  const result = await Orders.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Failed to update Orders');
  }
  return result;
};

const deleteOrders = async (id: string) => {
  const result = await Orders.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete orders');
  }
  return result;
};

export const ordersService = {
  createOrders,
  getAllOrders,
  getOrdersById,
  updateOrders,
  deleteOrders,
};