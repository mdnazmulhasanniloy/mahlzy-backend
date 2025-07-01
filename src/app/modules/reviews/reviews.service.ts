import httpStatus from 'http-status';
import { IReviews } from './reviews.interface';
import Reviews from './reviews.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { getAverageRating } from './reviews.utils';
import { ClientSession, startSession } from 'mongoose';
import Shop from '../shop/shop.models';

const createReviews = async (payload: IReviews) => {
  const session: ClientSession = await startSession();
  session.startTransaction();

  try {
    // Create the review
    const result: IReviews[] = await Reviews.create([payload], { session });
    if (!result || result?.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create review');
    }

    // Calculate the new average rating
    const { averageRating, totalReviews } = await getAverageRating(
      result[0]?.shop?.toString(),
    );

    const newAvgRating =
      (Number(averageRating) * Number(totalReviews) + Number(payload.rating)) /
      (totalReviews + 1);

    await Shop.findByIdAndUpdate(
      result[0].shop,
      {
        avgRating: newAvgRating,
        $addToSet: { reviews: result[0]?._id },
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error?.message || 'Review creation failed',
    );
  }
};

const getAllReviews = async (query: Record<string, any>) => {
  const reviewsModel = new QueryBuilder(
    Reviews.find().populate([
      { path: 'shop' },
      { path: 'user', select: 'name email phoneNumber profile' },
    ]),
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await reviewsModel.modelQuery;
  const meta = await reviewsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getReviewsById = async (id: string) => {
  const result = await Reviews.findById(id).populate([
    { path: 'shop' },
    { path: 'user', select: 'name email phoneNumber profile' },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Reviews not found!');
  }
  return result;
};

const updateReviews = async (id: string, payload: Partial<IReviews>) => {
  const result = await Reviews.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Reviews');
  }
  return result;
};

const deleteReviews = async (id: string) => {
  const session: ClientSession = await startSession();
  session.startTransaction();

  try {
    const result = await Reviews.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete review');
    }

    // Pull the review from the corresponding model (Apartment/Property)
    await Shop.findByIdAndUpdate(
      result?.shop,
      { $pull: { reviews: result?._id } },
      { session },
    );

    // Commit the transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error: any) {
    // Rollback the transaction if something goes wrong
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error?.message || 'Review deletion failed',
    );
  }
};

export const reviewsService = {
  createReviews,
  getAllReviews,
  getReviewsById,
  updateReviews,
  deleteReviews,
};
