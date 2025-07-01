import httpStatus from 'http-status';
import { IShop } from './shop.interface';
import Shop from './shop.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import pickQuery from '../../utils/pickQuery';
import { Types } from 'mongoose';
import { paginationHelper } from '../../helpers/pagination.helpers';

const createShop = async (payload: IShop) => {
  const result = await Shop.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create shop');
  }
  return result;
};

const getAllShop = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);

  const {
    searchTerm,
    latitude,
    longitude,
    ratingsFilter,
    categories,
    ...filtersData
  } = filters;

  if (filtersData?.author) {
    filtersData['author'] = new Types.ObjectId(filtersData?.author);
  }
  if (filtersData?._id) {
    filtersData['_id'] = new Types.ObjectId(filtersData?._id);
  }

  // if (filtersData?.ratings) {
  //   filtersData['reviews'] = new Types.ObjectId(filtersData?.ratings);
  // }

  // Initialize the aggregation pipeline
  const pipeline: any[] = [];

  // If latitude and longitude are provided, add $geoNear to the aggregation pipeline
  if (latitude && longitude) {
    pipeline.push({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        key: 'shopLocation',
        maxDistance: parseFloat(5 as unknown as string) * 1609, // 5 miles to meters
        distanceField: 'dist.calculated',
        spherical: true,
      },
    });
  }

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
        $or: ['shopName', 'shopMail'].map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      },
    });
  }

  // if (priceRange) {
  //   const [low, high] = priceRange.split('-').map(Number);

  //   pipeline.push({
  //     $match: {
  //       price: { $gte: low, $lte: high },
  //     },
  //   });
  // }

  if (ratingsFilter) {
    const ratingsArray = ratingsFilter?.split(',').map(Number);
    pipeline.push({
      $match: {
        avgRating: { $in: ratingsArray },
      },
    });
  }

  if (categories) {
    const categoriesArray = categories
      ?.split(',')
      .map((category: string) => new Types.ObjectId(category));
    pipeline.push({
      $match: {
        categories: { $in: categoriesArray },
      },
    });
  }

  if (Object.entries(filtersData).length) {
    Object.entries(filtersData).forEach(([field, value]) => {
      if (/^\[.*?\]$/.test(value)) {
        const match = value.match(/\[(.*?)\]/);
        const queryValue = match ? match[1] : value;
        pipeline.push({
          $match: {
            [field]: { $in: [new Types.ObjectId(queryValue)] },
          },
        });
        delete filtersData[field];
      } else {
        // 🔁 Convert to number if numeric string
        if (!isNaN(value)) {
          filtersData[field] = Number(value);
        }
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
            from: 'categories',
            localField: 'categories',
            foreignField: '_id',
            as: 'categories',
          },
        },
        {
          $lookup: {
            from: 'reviews',
            localField: 'reviews',
            foreignField: '_id',
            as: 'reviews',
          },
        },

        {
          $addFields: {
            author: { $arrayElemAt: ['$author', 0] },
            // facility: { $arrayElemAt: ['$facility', 0] },
            // ratings: { $arrayElemAt: ['$ratings', 0] },
          },
        },
      ],
    },
  });

  const [result] = await Shop.aggregate(pipeline);

  const total = result?.totalData?.[0]?.total || 0;
  const data = result?.paginatedData || [];

  return {
    meta: { page, limit, total },
    data,
  };
};

const getShopById = async (id: string) => {
  const result = await Shop.findById(id);
  if (!result || result?.isDeleted) {
    throw new Error('Shop not found!');
  }
  return result;
};

const updateShop = async (id: string, payload: Partial<IShop>) => {
  const result = await Shop.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Failed to update Shop');
  }
  return result;
};

const updateMyShop = async (id: string, payload: Partial<IShop>) => {
  const shop: IShop | null = await Shop.getShopByAuthor(id);
  if (!shop) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update shop');
  }
  const result = await Shop.findByIdAndUpdate(shop?._id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update shop');
  }
  return result;
};

const getMyShop = async (id: string) => {
  const shop: IShop | null = await Shop.getShopByAuthor(id);
  return shop;
};
const deleteShop = async (id: string) => {
  const result = await Shop.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete shop');
  }
  return result;
};

export const shopService = {
  createShop,
  getAllShop,
  getShopById,
  updateShop,
  deleteShop,
  getMyShop,
  updateMyShop,
};
