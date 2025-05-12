import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { addOneService } from './addOne.service';
import sendResponse from '../../utils/sendResponse';

const createAddOne = catchAsync(async (req: Request, res: Response) => {
  req.body['author'] = req.user.userId;
  const result = await addOneService.createAddOne(req.body, req.file);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'AddOne created successfully',
    data: result,
  });
});

const getAllAddOne = catchAsync(async (req: Request, res: Response) => {
  const result = await addOneService.getAllAddOne(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All addOne fetched successfully',
    data: result,
  });
});
const getMyAddOne = catchAsync(async (req: Request, res: Response) => {
  req.query['author'] = req.user.userId;
  const result = await addOneService.getAllAddOne(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My addOne fetched successfully',
    data: result,
  });
});

const getAddOneById = catchAsync(async (req: Request, res: Response) => {
  const result = await addOneService.getAddOneById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'AddOne fetched successfully',
    data: result,
  });
});
const updateAddOne = catchAsync(async (req: Request, res: Response) => {
  const result = await addOneService.updateAddOne(
    req.params.id,
    req.body,
    req.file,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'AddOne updated successfully',
    data: result,
  });
});

const deleteAddOne = catchAsync(async (req: Request, res: Response) => {
  const result = await addOneService.deleteAddOne(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'AddOne deleted successfully',
    data: result,
  });
});

export const addOneController = {
  createAddOne,
  getAllAddOne,
  getAddOneById,
  updateAddOne,
  deleteAddOne,
  getMyAddOne,
};
