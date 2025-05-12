
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { documentsService } from './documents.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const createDocuments = catchAsync(async (req: Request, res: Response) => {
 const result = await documentsService.createDocuments(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Documents created successfully',
    data: result,
  });

});

const getAllDocuments = catchAsync(async (req: Request, res: Response) => {

 const result = await documentsService.getAllDocuments(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All documents fetched successfully',
    data: result,
  });

});

const getDocumentsById = catchAsync(async (req: Request, res: Response) => {
 const result = await documentsService.getDocumentsById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Documents fetched successfully',
    data: result,
  });

});
const updateDocuments = catchAsync(async (req: Request, res: Response) => {
const result = await documentsService.updateDocuments(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Documents updated successfully',
    data: result,
  });

});


const deleteDocuments = catchAsync(async (req: Request, res: Response) => {
 const result = await documentsService.deleteDocuments(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Documents deleted successfully',
    data: result,
  });

});

export const documentsController = {
  createDocuments,
  getAllDocuments,
  getDocumentsById,
  updateDocuments,
  deleteDocuments,
};