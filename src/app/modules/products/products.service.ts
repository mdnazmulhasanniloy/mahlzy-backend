import httpStatus from 'http-status';
import { IProducts } from './products.interface';
import Products from './products.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { deleteManyFromS3, uploadManyToS3 } from '../../utils/s3';
import { UploadedFiles } from '../../interface/common.interface';
import { User } from '../user/user.models';
import pickQuery from '../../utils/pickQuery';
import { Types } from 'mongoose';
import { paginationHelper } from '../../helpers/pagination.helpers';
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

const getAllApartment = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);

  const { searchTerm, priceRange, ratingsFilter, toppings, ...filtersData } =
    filters;

  if (filtersData?.author) {
    filtersData['author'] = new Types.ObjectId(filtersData?.author);
  }

  if (filtersData?.shop) {
    filtersData['shop'] = new Types.ObjectId(filtersData?.shop);
  }

  if (filtersData?.category) {
    filtersData['category'] = new Types.ObjectId(filtersData?.category);
  }
  // if (filtersData?.toppings) {
  //   filtersData['toppings'] = new Types.ObjectId(filtersData?.toppings);
  // }

  // Initialize the aggregation pipeline
  const pipeline: any[] = [];

  // If latitude and longitude are provided, add $geoNear to the aggregation pipeline
  // if (latitude && longitude) {
  //   pipeline.push({
  //     $geoNear: {
  //       near: {
  //         type: 'Point',
  //         coordinates: [parseFloat(longitude), parseFloat(latitude)],
  //       },
  //       key: 'location',
  //       maxDistance: parseFloat(5 as unknown as string) * 1609, // 5 miles to meters
  //       distanceField: 'dist.calculated',
  //       spherical: true,
  //     },
  //   });
  // }

  // Add a match to exclude deleted documents
  pipeline.push({
    $match: {
      isDeleted: false,
    },
  });

  // If searchTerm is provided, add a search condition
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: ['name', 'Other'].map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      },
    });
  }

  if (priceRange) {
    const [low, high] = priceRange.split('-').map(Number);

    pipeline.push({
      $match: {
        price: { $gte: low, $lte: high },
      },
    });
  }

  if (ratingsFilter) {
    const ratingsArray = ratingsFilter?.split(',').map(Number);
    pipeline.push({
      $match: {
        avgRating: { $in: ratingsArray },
      },
    });
  }

  if (toppings) {
    const toppingsArray = toppings
      ?.split(',')
      .map((facility: string) => new Types.ObjectId(facility));
    pipeline.push({
      $match: {
        toppings: { $in: toppingsArray },
      },
    });
  }

  if (Object.entries(filtersData).length) {
    // Add custom filters (filtersData) to the aggregation pipeline
    Object.entries(filtersData).map(([field, value]) => {
      if (/^\[.*?\]$/.test(value)) {
        const match = value.match(/\[(.*?)\]/);
        const queryValue = match ? match[1] : value;
        pipeline.push({
          $match: {
            [field]: { $in: [new Types.ObjectId(queryValue)] },
          },
        });
        delete filtersData[field];
      }
    });

    if (Object.entries(filtersData).length) {
      pipeline.push({
        $match: {
          $and: Object.entries(filtersData).map(([field, value]) => ({
            isDeleted: false,
            [field]: value,
          })),
        },
      });
    }
  }

  // Sorting condition
  const { page, limit, skip, sort } =
    paginationHelper.calculatePagination(pagination);

  if (sort) {
    const sortArray = sort.split(',').map(field => {
      const trimmedField = field.trim();
      if (trimmedField.startsWith('-')) {
        return { [trimmedField.slice(1)]: -1 };
      }
      return { [trimmedField]: 1 };
    });

    pipeline.push({ $sort: Object.assign({}, ...sortArray) });
  }

  pipeline.push({
    $facet: {
      totalData: [{ $count: 'total' }],
      paginatedData: [
        { $skip: skip },
        { $limit: limit },
        // Lookups
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
            pipeline: [
              {
                $project: {
                  name: 1,
                  email: 1,
                  phoneNumber: 1,
                  profile: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'shop',
            localField: 'shop',
            foreignField: '_id',
            as: 'shop',
          },
        },

        {
          $lookup: {
            from: 'toppings',
            localField: 'toppings',
            foreignField: '_id',
            as: 'toppings',
          },
        },
        // {
        //   $lookup: {
        //     from: 'reviews',
        //     localField: 'reviews',
        //     foreignField: '_id',
        //     as: 'reviews',
        //   },
        // },

        {
          $addFields: {
            author: { $arrayElemAt: ['$author', 0] },
            shop: { $arrayElemAt: ['$shop', 0] },
            // facility: { $arrayElemAt: ['$facility', 0] },
            // ratings: { $arrayElemAt: ['$ratings', 0] },
          },
        },
      ],
    },
  });

  const [result] = await Products.aggregate(pipeline);

  const total = result?.totalData?.[0]?.total || 0;
  const data = result?.paginatedData || [];

  return {
    meta: { page, limit, total },
    data,
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
