import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { requestVendorService } from './requestVendor.service';
import sendResponse from '../../utils/sendResponse';

const createRequestVendor = catchAsync(async (req: Request, res: Response) => {
  const result = await requestVendorService.createRequestVendor(
    req.body,
    req.file,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'RequestVendor created successfully',
    data: result,
  });
});

const getAllRequestVendor = catchAsync(async (req: Request, res: Response) => {
  const result = await requestVendorService.getAllRequestVendor(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All requestVendor fetched successfully',
    data: result,
  });
});

const getRequestVendorById = catchAsync(async (req: Request, res: Response) => {
  const result = await requestVendorService.getRequestVendorById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'RequestVendor fetched successfully',
    data: result,
  });
});

const updateRequestVendor = catchAsync(async (req: Request, res: Response) => {
  const result = await requestVendorService.updateRequestVendor(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'RequestVendor updated successfully',
    data: result,
  });
});

const rejectRequestVendor = catchAsync(async (req: Request, res: Response) => {
  const result = await requestVendorService.rejectRequestVendor(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'RequestVendor rejected successfully',
    data: result,
  });
});

const approvedRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await requestVendorService.approveRequestVendor(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'vendor request approved successfully',
    data: result,
  });
});

const deleteRequestVendor = catchAsync(async (req: Request, res: Response) => {
  const result = await requestVendorService.deleteRequestVendor(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'RequestVendor deleted successfully',
    data: result,
  });
});

export const requestVendorController = {
  createRequestVendor,
  getAllRequestVendor,
  getRequestVendorById,
  updateRequestVendor,
  deleteRequestVendor,
  rejectRequestVendor,
  approvedRequest,
};
