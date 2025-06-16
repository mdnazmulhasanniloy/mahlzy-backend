import httpStatus from 'http-status';
import { IDeliveryMan } from './deliveryMan.interface';
import DeliveryMan from './deliveryMan.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import generateCryptoString from '../../utils/generateCryptoString';
import { USER_ROLE } from '../user/user.constants';
import { IUser } from '../user/user.interface';
import { startSession } from 'mongoose';
import path from 'path';
import { sendEmail } from '../../utils/mailSender';
import fs from 'fs';
import { IShop } from '../shop/shop.interface';

const createDeliveryMan = async (payload: IUser, userId: string) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const author: IUser | null = await User.findById(userId)
      .session(session)
      .populate('shop');
    if (!author) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'User not authorized to access this service',
      );
    }

    const password = generateCryptoString(6);
    const user = await User.create(
      [
        {
          name: payload?.name,
          email: payload?.email,
          phoneNumber: payload?.phoneNumber,
          password,
          expireAt: null,
          role: USER_ROLE.delivery_man,
          verification: { status: true },
        },
      ],
      { session },
    );

    if (!user || user?.length <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'delivery man account creation failed',
      );
    }
    console.log(!user, user?.length <= 0);
    const data = {
      user: user[0]?._id,
      shop: (author.shop as IShop)?._id,
      lastLocation: {
        type: 'Point',
        coordinates: [],
      },
    };

    const deliveryMan = await DeliveryMan.create([data], { session });

    await session.commitTransaction();
    session.endSession();

    const otpEmailPath = path.join(
      __dirname,
      '../../../../public/view/delivery_man_account_created.html',
    );

    await sendEmail(
      user[0]?.email,
      'Your One Time OTP',
      fs
        .readFileSync(otpEmailPath, 'utf8')
        .replace('{{name}}', user[0]?.name)
        .replace('{{email}}', user[0]?.email)
        .replace('{{password}}', password)
        .replace('{{shopName}}', (author?.shop as IShop)?.shopName),
    );

    return deliveryMan[0];
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error?.message ?? 'Failed to create deliveryMan',
    );
  }
};

const getAllDeliveryMan = async (query: Record<string, any>) => {
  const deliveryManModel = new QueryBuilder(
    DeliveryMan.find({ isDeleted: false }),
    query,
  )
    .search(['vehicleType'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await deliveryManModel.modelQuery;
  const meta = await deliveryManModel.countTotal();

  return {
    data,
    meta,
  };
};

const getDeliveryManById = async (id: string) => {
  const result = await DeliveryMan.findById(id);
  if (!result || result?.isDeleted) {
    throw new Error('DeliveryMan not found!');
  }
  return result;
};

const updateDeliveryMan = async (
  id: string,
  payload: Partial<IDeliveryMan>,
) => {
  const result = await DeliveryMan.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new Error('Failed to update DeliveryMan');
  }
  return result;
};

const deleteDeliveryMan = async (id: string) => {
  const result = await DeliveryMan.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete deliveryMan');
  }
  return result;
};

export const deliveryManService = {
  createDeliveryMan,
  getAllDeliveryMan,
  getDeliveryManById,
  updateDeliveryMan,
  deleteDeliveryMan,
};
