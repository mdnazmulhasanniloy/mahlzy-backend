
import httpStatus from 'http-status';
import { IDocuments } from './documents.interface';
import Documents from './documents.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createDocuments = async (payload: IDocuments) => {
  const result = await Documents.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create documents');
  }
  return result;
};

const getAllDocuments = async (query: Record<string, any>) => { 
  const documentsModel = new QueryBuilder(Documents.find(), query)
    .search([""])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await documentsModel.modelQuery;
  const meta = await documentsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getDocumentsById = async (id: string) => {
  const result = await Documents.findById(id);
  if (!result) {
    throw new Error('Documents not found!');
  }
  return result;
};

const updateDocuments = async (id: string, payload: Partial<IDocuments>) => {
  const result = await Documents.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Failed to update Documents');
  }
  return result;
};

const deleteDocuments = async (id: string) => {
  const result = await Documents.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete documents');
  }
  return result;
};

export const documentsService = {
  createDocuments,
  getAllDocuments,
  getDocumentsById,
  updateDocuments,
  deleteDocuments,
};