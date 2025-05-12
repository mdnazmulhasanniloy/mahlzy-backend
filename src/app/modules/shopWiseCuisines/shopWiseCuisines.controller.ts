import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { shopWiseCuisinesService } from './shopWiseCuisines.service';
import sendResponse from '../../utils/sendResponse';

const createShopWiseCuisines = catchAsync(
  async (req: Request, res: Response) => {
    req.body.shop = req.user.userId;
    const result = await shopWiseCuisinesService.createShopWiseCuisines(
      req.body,
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'ShopWiseCuisines created successfully',
      data: result,
    });
  },
);

const getAllShopWiseCuisines = catchAsync(
  async (req: Request, res: Response) => {
    const result = await shopWiseCuisinesService.getAllShopWiseCuisines(
      req.query,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All shopWiseCuisines fetched successfully',
      data: result,
    });
  },
);
const getMyShopWiseCuisines = catchAsync(
  async (req: Request, res: Response) => {
    req.query['shop'] = req.user.userId;
    const result = await shopWiseCuisinesService.getAllShopWiseCuisines(
      req.query,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All shopWiseCuisines fetched successfully',
      data: result,
    });
  },
);

const getShopWiseCuisinesById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await shopWiseCuisinesService.getShopWiseCuisinesById(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'ShopWiseCuisines fetched successfully',
      data: result,
    });
  },
);
const updateShopWiseCuisines = catchAsync(
  async (req: Request, res: Response) => {
    const result = await shopWiseCuisinesService.updateShopWiseCuisines(
      req.params.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'ShopWiseCuisines updated successfully',
      data: result,
    });
  },
);

const deleteShopWiseCuisines = catchAsync(
  async (req: Request, res: Response) => {
    const result = await shopWiseCuisinesService.deleteShopWiseCuisines(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'ShopWiseCuisines deleted successfully',
      data: result,
    });
  },
);

export const shopWiseCuisinesController = {
  createShopWiseCuisines,
  getAllShopWiseCuisines,
  getShopWiseCuisinesById,
  updateShopWiseCuisines,
  deleteShopWiseCuisines,
  getMyShopWiseCuisines,
};
