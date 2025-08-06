import httpStatus from 'http-status';
import { ICampaign } from './campaign.interface';
import Campaign from './campaign.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import Shop from '../shop/shop.models';

const createCampaign = async (payload: ICampaign, userId: string) => {
  const shop = await Shop.findOne({ author: userId });
  if (!shop) throw new AppError(httpStatus.BAD_REQUEST, 'shop not found');
  // @ts-ignore
  payload['shop'] = shop?._id?.toString();
  const result = await Campaign.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create campaign');
  }
  return result;
};

const getAllCampaign = async (query: Record<string, any>) => {
  const campaignModel = new QueryBuilder(
    Campaign.find({}).populate('shop'),
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await campaignModel.modelQuery;
  const meta = await campaignModel.countTotal();

  return {
    data,
    meta,
  };
};

const getCampaignById = async (id: string) => {
  const result = await Campaign.findById(id).populate('shop');
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Campaign not found!');
  }
  return result;
};

const updateCampaign = async (id: string, payload: Partial<ICampaign>) => {
  const result = await Campaign.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Campaign');
  }
  return result;
};

const deleteCampaign = async (id: string) => {
  const result = await Campaign.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete campaign');
  }
  return result;
};

export const campaignService = {
  createCampaign,
  getAllCampaign,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
};
