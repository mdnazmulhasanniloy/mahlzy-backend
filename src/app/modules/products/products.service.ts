import httpStatus from 'http-status';
import { IProducts } from './products.interface';
import Products from './products.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { deleteManyFromS3, uploadManyToS3 } from '../../utils/s3';
import { UploadedFiles } from '../../interface/common.interface';
import { User } from '../user/user.models'; 
const createProducts = async (payload: IProducts, files: any) => {
  const author = await User.findById(payload.author);
  if (!author || !author?.shop || author?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Author not found');
  }

  //@ts-ignore
  payload.shop = author.shop;

  if (files) {
    const { images } = files;
    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images?.map(async (image: any) => {
        imgsArray.push({
          file: image,
          path: `images/banner`,
        });
      });

      payload.images = await uploadManyToS3(imgsArray);
    }
  }

  const result = await Products.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create products');
  }
  return result;
};

const getAllProducts = async (query: Record<string, any>) => {
  const productsModel = new QueryBuilder(
    Products.find({ isDeleted: false }),
    query,
  )
    .search(['name', 'shortDescriptions', 'descriptions'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await productsModel.modelQuery;
  const meta = await productsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getProductsById = async (id: string) => {
  const result = await Products.findById(id);
  if (!result || result?.isDeleted) {
    throw new Error('Products not found!');
  }
  return result;
};

const updateProducts = async (
  id: string,
  payload: Partial<IProducts>,
  files: any,
) => {
  const { deleteKey, ...updateData } = payload; // color isn't used, so removed it

  // Handle image upload to S3
  if (files) {
    const { images } = files as UploadedFiles;

    if (images?.length) {
      const imgsArray = images.map(image => ({
        file: image,
        path: 'images/product', // Ensure path consistency
      }));

      try {
        payload.images = await uploadManyToS3(imgsArray); // Await all uploads before proceeding
      } catch (error) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Image upload failed',
        );
      }
    }
  }

  // Handle image deletions (if any)
  if (deleteKey && deleteKey.length > 0) {
    const newKey = deleteKey.map((key: any) => `images/product${key}`);
    if (newKey.length > 0) {
      try {
        await deleteManyFromS3(newKey); // Delete images from S3
      } catch (error) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Image deletion failed',
        );
      }

      // Remove deleted images from the product
      await Products.findByIdAndUpdate(
        id,
        {
          $pull: { images: { key: { $in: deleteKey } } },
        },
        { new: true },
      );
    }
  }

  // If new images are provided, push them to the product
  if (payload?.images && payload.images.length > 0) {
    try {
      await Products.findByIdAndUpdate(
        id,
        { $addToSet: { images: { $each: payload.images } } }, // Push new images to the product
        { new: true },
      );
      delete payload.images; // Remove images from the payload after pushing
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update images',
      );
    }
  }

  // Update other product details
  try {
    const result = await Products.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Product update failed');
    }
    return result;
  } catch (error) {
    console.log(error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Product update failed',
    );
  }
};
const deleteProducts = async (id: string) => {
  const result = await Products.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete products');
  }
  return result;
};

export const productsService = {
  createProducts,
  getAllProducts,
  getProductsById,
  updateProducts,
  deleteProducts,
};
