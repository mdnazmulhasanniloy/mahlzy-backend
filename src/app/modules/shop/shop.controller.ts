import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { shopService } from './shop.service';
import sendResponse from '../../utils/sendResponse';
import { uploadToS3 } from '../../utils/s3';

const createShop = catchAsync(async (req: Request, res: Response) => {
  const result = await shopService.createShop(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Shop created successfully',
    data: result,
  });
});

const getAllShop = catchAsync(async (req: Request, res: Response) => {
  const result = await shopService.getAllShop(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All shop fetched successfully',
    data: result,
  });
});

const getMyShop = catchAsync(async (req: Request, res: Response) => {
  const result = await shopService.getMyShop(req?.user?.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My Shop fetched successfully',
    data: result,
  });
});

const getShopById = catchAsync(async (req: Request, res: Response) => {
  const result = await shopService.getShopById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shop fetched successfully',
    data: result,
  });
});

const updateShop = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.banner = await uploadToS3({
      file: req.file,
      fileName: `images/shop/banner/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }
  const result = await shopService.updateShop(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shop updated successfully',
    data: result,
  });
});

const updateMyShop = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.banner = await uploadToS3({
      file: req.file,
      fileName: `images/shop/banner/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }
  const result = await shopService.updateMyShop(req?.user?.userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My Shop updated successfully',
    data: result,
  });
});

const deleteShop = catchAsync(async (req: Request, res: Response) => {
  const result = await shopService.deleteShop(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shop deleted successfully',
    data: result,
  });
});

export const shopController = {
  createShop,
  getAllShop,
  getShopById,
  updateShop,
  deleteShop,
  getMyShop,
  updateMyShop,
};
