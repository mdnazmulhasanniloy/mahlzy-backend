import httpStatus from 'http-status';
import { IShop } from './shop.interface';
import Shop from './shop.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createShop = async (payload: IShop) => {
  const result = await Shop.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create shop');
  }
  return result;
};

const getAllShop = async (query: Record<string, any>) => {
  const shopModel = new QueryBuilder(Shop.find({ isDeleted: false }), query)
    .search(['shopName', 'shopMail', 'shopPhoneNumber', 'id'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await shopModel.modelQuery;
  const meta = await shopModel.countTotal();

  return {
    data,
    meta,
  };
};

const getShopById = async (id: string) => {
  const result = await Shop.findById(id);
  if (!result || result?.isDeleted) {
    throw new Error('Shop not found!');
  }
  return result;
};

const updateShop = async (id: string, payload: Partial<IShop>) => {
  const result = await Shop.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Failed to update Shop');
  }
  return result;
};

const updateMyShop = async (id: string, payload: Partial<IShop>) => {
  const shop: IShop | null = await Shop.getShopByAuthor(id);
  if (!shop) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update shop');
  }
  const result = await Shop.findByIdAndUpdate(shop?._id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update shop');
  }
  return result;
};

const getMyShop = async (id: string) => {
  const shop: IShop | null = await Shop.getShopByAuthor(id);
  return shop;
};
const deleteShop = async (id: string) => {
  const result = await Shop.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete shop');
  }
  return result;
};

export const shopService = {
  createShop,
  getAllShop,
  getShopById,
  updateShop,
  deleteShop,
  getMyShop,
  updateMyShop,
};
