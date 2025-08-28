import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { cuisinesService } from './cuisines.service';
import sendResponse from '../../utils/sendResponse';

const createCuisines = catchAsync(async (req: Request, res: Response) => {
  const result = await cuisinesService.createCuisines(
    req.body,
    req.user.userId as string,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Cuisines created successfully',
    data: result,
  });
});

const getAllCuisines = catchAsync(async (req: Request, res: Response) => {
  const result = await cuisinesService.getAllCuisines(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All cuisines fetched successfully',
    data: result,
  });
});

const getCuisinesById = catchAsync(async (req: Request, res: Response) => {
  const result = await cuisinesService.getCuisinesById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cuisines fetched successfully',
    data: result,
  });
});
const updateCuisines = catchAsync(async (req: Request, res: Response) => {
  const result = await cuisinesService.updateCuisines(
    req.params.id,
    req.body,
    req.file,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cuisines updated successfully',
    data: result,
  });
});

const deleteCuisines = catchAsync(async (req: Request, res: Response) => {
  const result = await cuisinesService.deleteCuisines(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cuisines deleted successfully',
    data: result,
  });
});

export const cuisinesController = {
  createCuisines,
  getAllCuisines,
  getCuisinesById,
  updateCuisines,
  deleteCuisines,
};
