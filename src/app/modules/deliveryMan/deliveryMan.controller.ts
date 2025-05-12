
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { deliveryManService } from './deliveryMan.service';
import sendResponse from '../../utils/sendResponse'; 

const createDeliveryMan = catchAsync(async (req: Request, res: Response) => {
 const result = await deliveryManService.createDeliveryMan(req.body, req.user.userId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'DeliveryMan created successfully',
    data: result,
  });

});

const getAllDeliveryMan = catchAsync(async (req: Request, res: Response) => {

 const result = await deliveryManService.getAllDeliveryMan(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All deliveryMan fetched successfully',
    data: result,
  });

});

const getDeliveryManById = catchAsync(async (req: Request, res: Response) => {
 const result = await deliveryManService.getDeliveryManById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'DeliveryMan fetched successfully',
    data: result,
  });

});
const updateDeliveryMan = catchAsync(async (req: Request, res: Response) => {
const result = await deliveryManService.updateDeliveryMan(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'DeliveryMan updated successfully',
    data: result,
  });

});


const deleteDeliveryMan = catchAsync(async (req: Request, res: Response) => {
 const result = await deliveryManService.deleteDeliveryMan(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'DeliveryMan deleted successfully',
    data: result,
  });

});

export const deliveryManController = {
  createDeliveryMan,
  getAllDeliveryMan,
  getDeliveryManById,
  updateDeliveryMan,
  deleteDeliveryMan,
};