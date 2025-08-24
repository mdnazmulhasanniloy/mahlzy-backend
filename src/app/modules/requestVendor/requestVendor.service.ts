import httpStatus from 'http-status';
import { IRequestVendor } from './requestVendor.interface';
import RequestVendor from './requestVendor.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { uploadToS3 } from '../../utils/s3';
import path from 'path';
import { sendEmail } from '../../utils/mailSender';
import fs from 'fs';
import Shop from '../shop/shop.models';
import generateCryptoString from '../../utils/generateCryptoString';
import { User } from '../user/user.models';
import { USER_ROLE } from '../user/user.constants';
import { startSession } from 'mongoose';

const createRequestVendor = async (payload: IRequestVendor, file: any) => {
  const isAlreadyExistName = await Shop.findOne({
    shopName: payload.businessName,
  });

  if (isAlreadyExistName) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Already have a account using this shop name',
    );
  }

  const isAlreadyExistEmail = await Shop.findOne({
    shopName: payload.businessName,
  });

  if (isAlreadyExistEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Already have a account using this email',
    );
  }
  const isAlreadyExistPhone = await Shop.findOne({
    shopPhoneNumber: payload.phoneNumber,
  });
  if (isAlreadyExistPhone) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Already have a account using this phoneNumber',
    );
  }

  if (file) {
    payload.image = (await uploadToS3({
      file: file,
      fileName: `images/user/profile/${Math.floor(100000 + Math.random() * 900000)}`,
    })) as string;
  }
  const result = await RequestVendor.create(payload);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create requestVendor',
    );
  }

  return result;
};

const getAllRequestVendor = async (query: Record<string, any>) => {
  const requestVendorModel = new QueryBuilder(RequestVendor.find(), query)
    .search(['businessName', 'userName', 'businessEmail'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await requestVendorModel.modelQuery;
  const meta = await requestVendorModel.countTotal();

  return {
    data,
    meta,
  };
};

const getRequestVendorById = async (id: string) => {
  const result = await RequestVendor.findById(id);
  if (!result) {
    throw new Error('RequestVendor not found!');
  }
  return result;
};

const updateRequestVendor = async (
  id: string,
  payload: Partial<IRequestVendor>,
) => {
  const result = await RequestVendor.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new Error('Failed to update RequestVendor');
  }
  return result;
};

const deleteRequestVendor = async (id: string) => {
  const result = await RequestVendor.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete requestVendor',
    );
  }
  return result;
};

const approveRequestVendor = async (id: string) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const request: IRequestVendor | null =
      await RequestVendor.findById(id).session(session);
    console.log("🚀 ~ approveRequestVendor ~ request:", request)
    if (!request) {
      throw new AppError(httpStatus.BAD_REQUEST, 'RequestVendor not found');
    }
    const password = generateCryptoString(6);
    const user = await User.create(
      [
        {
          name: request.businessName,
          email: request.businessEmail,
          phoneNumber: request.phoneNumber,
          password: password,
          role: USER_ROLE.restaurant,
          expireAt: null,
          verification: { status: true },
        },
      ],
      { session },
    );

    if (!user || user.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
    }

    const vendor = await Shop.create(
      [
        {
          shopName: request?.businessName,
          author: user[0]._id,
          shopMail: request.businessEmail,
          shopPhoneNumber: request.phoneNumber,
          shopLocation: {
            type: 'Point',
            coordinates: [40.712776, -74.005974],
          },
        },
      ],
      { session },
    );

    if (!vendor || vendor.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Vendor creation failed');
    }

    await User.findByIdAndUpdate(
      user[0]._id,
      { shop: vendor[0]._id },
      { session },
    );

    const otpEmailPath = path.join(
      __dirname,
      '../../../../public/view/vendor_account_created.html',
    );
    await sendEmail(
      request.businessEmail,
      'Your Vendor Request has been approved',
      fs
        .readFileSync(otpEmailPath, 'utf8')
        .replace('{{account_email}}', request.businessEmail)
        .replace('{{account_password}}', password)
        .replace('{{vendor_name}}', request.businessName),
    );

    // Delete the RequestVendor after successfully creating the vendor
    await RequestVendor.findByIdAndDelete(id, { session });

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();
    return vendor;
  } catch (error) {
    // Rollback the transaction if any operation fails
    await session.abortTransaction();
    session.endSession();
    throw error; // Re-throw the error to propagate it
  }
};

const rejectRequestVendor = async (id: string, payload: { reason: string }) => {
  const result = await RequestVendor.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete requestVendor',
    );
  }

  const otpEmailPath = path.join(
    __dirname,
    '../../../../public/view/reject_vendor_request.html',
  );

  await sendEmail(
    result?.businessEmail,
    'Your Vendor Request has been rejected',
    fs
      .readFileSync(otpEmailPath, 'utf8')
      .replace('{{vendor_name}}', result?.businessName)
      .replace('{{request}}', payload?.reason),
  );

  return result;
};

export const requestVendorService = {
  createRequestVendor,
  getAllRequestVendor,
  getRequestVendorById,
  updateRequestVendor,
  deleteRequestVendor,
  rejectRequestVendor,
  approveRequestVendor,
};
