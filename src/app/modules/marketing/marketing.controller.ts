import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { marketingService } from './marketing.service';
import sendResponse from '../../utils/sendResponse';
import Shop from '../shop/shop.models';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const createMarketing = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req?.user?.userId;
  const result = await marketingService.createMarketing(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Marketing created successfully',
    data: result,
  });
});

const getAllMarketing = catchAsync(async (req: Request, res: Response) => {
  const result = await marketingService.getAllMarketing(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All marketing fetched successfully',
    data: result,
  });
});
const getMyMarketing = catchAsync(async (req: Request, res: Response) => {
  if (req.user.userId) {
    const shop = await Shop.findOne({ author: req.user.userId });
    if (!shop) throw new AppError(httpStatus.BAD_REQUEST, 'Shop not found!');
    req.query['shop'] = shop?._id;
  }

  const result = await marketingService.getAllMarketing(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All marketing fetched successfully',
    data: result,
  });
});

const getMarketingById = catchAsync(async (req: Request, res: Response) => {
  const result = await marketingService.getMarketingById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Marketing fetched successfully',
    data: result,
  });
});
const updateMarketing = catchAsync(async (req: Request, res: Response) => {
  const result = await marketingService.updateMarketing(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Marketing updated successfully',
    data: result,
  });
});

const deleteMarketing = catchAsync(async (req: Request, res: Response) => {
  const result = await marketingService.deleteMarketing(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Marketing deleted successfully',
    data: result,
  });
});

export const marketingController = {
  createMarketing,
  getAllMarketing,
  getMarketingById,
  updateMarketing,
  deleteMarketing,
  getMyMarketing,
};
