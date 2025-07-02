import httpStatus from 'http-status';
import { IShop } from './shop.interface';
import Shop from './shop.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import pickQuery from '../../utils/pickQuery';
import { Types } from 'mongoose';
import { paginationHelper } from '../../helpers/pagination.helpers';
import Products from '../products/products.models';
import { User } from '../user/user.models';

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
    priceRange,
    categories,
    ...filtersData
  } = filters;

  const pipeline: any[] = [];

  // Geo-based filtering
  if (latitude && longitude) {
    pipeline.push({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        key: 'shopLocation',
        maxDistance: 5 * 1609, // 5 miles in meters
        distanceField: 'dist.calculated',
        spherical: true,
      },
    });
  }

  // Always filter out deleted shops
  pipeline.push({ $match: { isDeleted: false } });

  // Search term
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: ['shopName', 'shopMail'].map(field => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
      },
    });
  }

  // Filter shops by associated product price range
  if (priceRange) {
    const [low, high] = priceRange.split('-').map(Number);
    const products = await Products.find(
      { price: { $gte: low, $lte: high } },
      { author: 1 },
    ).lean();

    const authorIds = Array.from(
      new Set(products.map(p => p.author?.toString()).filter(Boolean)),
    );

    const users = await User.find(
      { _id: { $in: authorIds } },
      { shop: 1 },
    ).lean();

    const shopIds = users.map(user => user.shop?.toString()).filter(Boolean);

    if (shopIds.length) {
      pipeline.push({
        $match: { _id: { $in: shopIds.map(id => new Types.ObjectId(id)) } },
      });
    } else {
      // No shop matches, early return
      return { meta: { page: 1, limit: 10, total: 0 }, data: [] };
    }
  }

  // Ratings filter
  if (ratingsFilter) {
    const ratingsArray = ratingsFilter.split(',').map(Number);
    pipeline.push({ $match: { avgRating: { $in: ratingsArray } } });
  }

  // Category filter
  if (categories) {
    const categoriesArray = categories
      .split(',')
      .map((id: string) => new Types.ObjectId(id));
    pipeline.push({ $match: { categories: { $in: categoriesArray } } });
  }

  // Handle other filters (including `_id`, `author`)
  for (const [field, value] of Object.entries(filtersData)) {
    if (value && /^\[.*\]$/.test(value)) {
      const match = value.match(/\[(.*?)\]/);
      const queryValue = match?.[1];
      if (queryValue) {
        pipeline.push({
          $match: {
            [field]: { $in: [new Types.ObjectId(queryValue)] },
          },
        });
      }
    } else {
      let castedValue: any = value;
      if (Types.ObjectId.isValid(value))
        castedValue = new Types.ObjectId(value);
      if (!isNaN(value)) castedValue = Number(value);

      pipeline.push({ $match: { [field]: castedValue } });
    }
  }

  // Pagination and Sorting
  const { page, limit, skip, sort } =
    paginationHelper.calculatePagination(pagination);

  if (sort) {
    const sortObject = sort.split(',').reduce(
      (acc, field) => {
        const trimmed = field.trim();
        if (trimmed.startsWith('-')) acc[trimmed.slice(1)] = -1;
        else acc[trimmed] = 1;
        return acc;
      },
      {} as Record<string, 1 | -1>,
    );
    pipeline.push({ $sort: sortObject });
  }

  pipeline.push({
    $facet: {
      totalData: [{ $count: 'total' }],
      paginatedData: [
        { $skip: skip },
        { $limit: limit },
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
          },
        },
      ],
    },
  });

  const [result] = await Shop.aggregate(pipeline);

  return {
    meta: {
      page,
      limit,
      total: result?.totalData?.[0]?.total || 0,
    },
    data: result?.paginatedData || [],
  };
};

const getShopById = async (id: string) => {
  const result = await Shop.findById(id).populate([
    { path: 'reviews' },
    { path: 'categories' },
    { path: 'author', select: 'name email phoneNumber profile' },
  ]);
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
