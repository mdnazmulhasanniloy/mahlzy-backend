import { Types } from 'mongoose';
import Reviews from './reviews.models';

interface IReturn {
  averageRating: number;
  totalReviews: number;
}
export const getAverageRating = async (shopId: string): Promise<IReturn> => {
  const result = await Reviews.aggregate([
    {
      $match: { shop: new Types.ObjectId(shopId) }, // Filter by reference ID
    },
    {
      $group: {
        _id: '$shop',
        averageRating: { $avg: '$rating' }, // Calculate average rating
        totalReviews: { $sum: 1 }, // Count total reviews
      },
    },
  ]);

  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }

  return result[0]; // Return the first result
};
