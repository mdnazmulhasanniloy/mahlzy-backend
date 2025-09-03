
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { attributeService } from './attribute.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const createAttribute = catchAsync(async (req: Request, res: Response) => {
 const result = await attributeService.createAttribute(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Attribute created successfully',
    data: result,
  });

});

const getAllAttribute = catchAsync(async (req: Request, res: Response) => {

 const result = await attributeService.getAllAttribute(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All attribute fetched successfully',
    data: result,
  });

});

const getAttributeById = catchAsync(async (req: Request, res: Response) => {
 const result = await attributeService.getAttributeById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Attribute fetched successfully',
    data: result,
  });

});
const updateAttribute = catchAsync(async (req: Request, res: Response) => {
const result = await attributeService.updateAttribute(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Attribute updated successfully',
    data: result,
  });

});


const deleteAttribute = catchAsync(async (req: Request, res: Response) => {
 const result = await attributeService.deleteAttribute(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Attribute deleted successfully',
    data: result,
  });

});

export const attributeController = {
  createAttribute,
  getAllAttribute,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
};