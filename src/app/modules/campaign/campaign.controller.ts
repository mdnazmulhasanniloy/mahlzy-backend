import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { campaignService } from './campaign.service';
import sendResponse from '../../utils/sendResponse';
import { uploadToS3 } from '../../utils/s3';
import Shop from '../shop/shop.models';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const createCampaign = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.banner = await uploadToS3({
      file: req.file,
      fileName: Math.floor(100000 + Math.random() * 9000000)?.toString(),
    });
  }
  const result = await campaignService.createCampaign(
    req.body,
    req.user.userId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Campaign created successfully',
    data: result,
  });
});

const getAllCampaign = catchAsync(async (req: Request, res: Response) => {
  const result = await campaignService.getAllCampaign(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All campaign fetched successfully',
    data: result,
  });
});


const getMyCampaign = catchAsync(async (req: Request, res: Response) => {
  const shop = await Shop.findOne({ author: req.user.userId });
  if (!shop) throw new AppError(httpStatus.BAD_REQUEST, 'shop not found');
  // @ts-ignore
  req.query['shop'] = shop?._id?.toString();
  const result = await campaignService.getAllCampaign(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All campaign fetched successfully',
    data: result,
  });
});

const getCampaignById = catchAsync(async (req: Request, res: Response) => {
  const result = await campaignService.getCampaignById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Campaign fetched successfully',
    data: result,
  });
});
const updateCampaign = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.banner = await uploadToS3({
      file: req.file,
      fileName: Math.floor(100000 + Math.random() * 9000000)?.toString(),
    });
  }
  const result = await campaignService.updateCampaign(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Campaign updated successfully',
    data: result,
  });
});

const deleteCampaign = catchAsync(async (req: Request, res: Response) => {
  const result = await campaignService.deleteCampaign(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Campaign deleted successfully',
    data: result,
  });
});

export const campaignController = {
  createCampaign,
  getAllCampaign,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getMyCampaign,
};
