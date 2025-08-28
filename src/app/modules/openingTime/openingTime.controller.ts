import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { openingTimeService } from './openingTime.service';
import sendResponse from '../../utils/sendResponse';

const createOpeningTime = catchAsync(async (req: Request, res: Response) => {
  const result = await openingTimeService.createOpeningTime(
    req.body,
    req.user.userId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'OpeningTime created successfully',
    data: result,
  });
});

const getAllOpeningTime = catchAsync(async (req: Request, res: Response) => {
  const result = await openingTimeService.getAllOpeningTime(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All openingTime fetched successfully',
    data: result,
  });
});
const getResturantOpeningTimeById = catchAsync(
  async (req: Request, res: Response) => {
    req.query['shop'] = req.params.id;
    const result = await openingTimeService.getAllOpeningTime(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All openingTime fetched successfully',
      data: result,
    });
  },
);

const getOpeningTimeById = catchAsync(async (req: Request, res: Response) => {
  const result = await openingTimeService.getOpeningTimeById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OpeningTime fetched successfully',
    data: result,
  });
});

const updateOpeningTime = catchAsync(async (req: Request, res: Response) => {
  const result = await openingTimeService.updateOpeningTime(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OpeningTime updated successfully',
    data: result,
  });
});

const deleteOpeningTime = catchAsync(async (req: Request, res: Response) => {
  const result = await openingTimeService.deleteOpeningTime(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OpeningTime deleted successfully',
    data: result,
  });
});

export const openingTimeController = {
  createOpeningTime,
  getAllOpeningTime,
  getOpeningTimeById,
  updateOpeningTime,
  deleteOpeningTime,
  getResturantOpeningTimeById,
};
