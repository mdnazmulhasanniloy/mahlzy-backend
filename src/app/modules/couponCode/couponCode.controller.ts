
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { couponCodeService } from './couponCode.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const createCouponCode = catchAsync(async (req: Request, res: Response) => {
 const result = await couponCodeService.createCouponCode(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'CouponCode created successfully',
    data: result,
  });

});

const getAllCouponCode = catchAsync(async (req: Request, res: Response) => {

 const result = await couponCodeService.getAllCouponCode(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All couponCode fetched successfully',
    data: result,
  });

});

const getCouponCodeById = catchAsync(async (req: Request, res: Response) => {
 const result = await couponCodeService.getCouponCodeById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'CouponCode fetched successfully',
    data: result,
  });

});
const updateCouponCode = catchAsync(async (req: Request, res: Response) => {
const result = await couponCodeService.updateCouponCode(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'CouponCode updated successfully',
    data: result,
  });

});


const deleteCouponCode = catchAsync(async (req: Request, res: Response) => {
 const result = await couponCodeService.deleteCouponCode(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'CouponCode deleted successfully',
    data: result,
  });

});

export const couponCodeController = {
  createCouponCode,
  getAllCouponCode,
  getCouponCodeById,
  updateCouponCode,
  deleteCouponCode,
};