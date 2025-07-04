import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { productsService } from './products.service';
import sendResponse from '../../utils/sendResponse';
import Shop from '../shop/shop.models';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const createProducts = catchAsync(async (req: Request, res: Response) => {
  req.body['author'] = req.user.userId;
  const result = await productsService.createProducts(req.body, req.files);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Products created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productsService.getAllProducts(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All products fetched successfully',
    data: result,
  });
});

const getMyProducts = catchAsync(async (req: Request, res: Response) => {
  req.query['author'] = req.user.userId;
  const result = await productsService.getAllProducts(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All products fetched successfully',
    data: result,
  });
});

const getShopWiseProducts = catchAsync(async (req: Request, res: Response) => {
  const shop = await Shop.findById(req.params.shopId);
  if (!shop) {
    throw new AppError(httpStatus.BAD_REQUEST, 'resturant not found!');
  }
  req.query['author'] = shop?.author?.toString();
  // req.query['shop'] = req.params.shopId;
  const result = await productsService.getAllProducts(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All products fetched successfully',
    data: result,
  });
});

const getProductsById = catchAsync(async (req: Request, res: Response) => {
  const result = await productsService.getProductsById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products fetched successfully',
    data: result,
  });
});

const updateProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productsService.updateProducts(
    req.params.id,
    req.body,
    req.files,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products updated successfully',
    data: result,
  });
});

const deleteProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productsService.deleteProducts(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products deleted successfully',
    data: result,
  });
});

export const productsController = {
  createProducts,
  getAllProducts,
  getProductsById,
  updateProducts,
  deleteProducts,
  getMyProducts,
  getShopWiseProducts,
};
