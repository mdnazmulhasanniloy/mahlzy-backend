import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { toppingService } from './topping.service';
import sendResponse from '../../utils/sendResponse';
import { User } from '../user/user.models';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import Shop from '../shop/shop.models';

const createTopping = catchAsync(async (req: Request, res: Response) => {
  req.body['author'] = req.user.userId;
  const result = await toppingService.createTopping(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Topping created successfully',
    data: result,
  });
});

const getAllTopping = catchAsync(async (req: Request, res: Response) => {
  const result = await toppingService.getAllTopping(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All topping fetched successfully',
    data: result,
  });
});
const getMyTopping = catchAsync(async (req: Request, res: Response) => {
  req.query['author'] = req.user.userId;
  const result = await toppingService.getAllTopping(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All topping fetched successfully',
    data: result,
  });
});
const getShopTopping = catchAsync(async (req: Request, res: Response) => {
  const shop = await Shop.findById(req.params.shopId);
  if (!shop) {
    throw new AppError(httpStatus.BAD_REQUEST, 'resturant not found!');
  }
  req.query['author'] = shop?.author?.toString();
  const result = await toppingService.getAllTopping(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All topping fetched successfully',
    data: result,
  });
});

const getToppingById = catchAsync(async (req: Request, res: Response) => {
  const result = await toppingService.getToppingById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Topping fetched successfully',
    data: result,
  });
});
const updateTopping = catchAsync(async (req: Request, res: Response) => {
  const result = await toppingService.updateTopping(
    req.params.id,
    req.body, 
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Topping updated successfully',
    data: result,
  });
});

const deleteTopping = catchAsync(async (req: Request, res: Response) => {
  const result = await toppingService.deleteTopping(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Topping deleted successfully',
    data: result,
  });
});

export const toppingController = {
  createTopping,
  getAllTopping,
  getMyTopping,
  getShopTopping,
  getToppingById,
  updateTopping,
  deleteTopping,
};
