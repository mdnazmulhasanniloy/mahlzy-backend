import httpStatus from 'http-status';
import { IOrders } from './orders.interface';
import Orders from './orders.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import CouponCode from '../couponCode/couponCode.models';
import { ORDER_STATUS } from './orders.constants';
import { notificationServices } from '../notification/notification.service';
import { modeType } from '../notification/notification.interface';
import { IUser } from '../user/user.interface';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { isAfter, isBefore, subHours, subMinutes } from 'date-fns';
import moment from 'moment';

const createOrders = async (payload: IOrders) => {
  const author = await User.findById(payload.author);
  if (!author) {
    throw new AppError(httpStatus.NOT_FOUND, 'author not found');
  }

  if (payload.coupon) {
    const coupon = await CouponCode.findByCode(payload.coupon);
    if (!coupon || !coupon?.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, 'coupon code is invalid');
    }
  }

  const result = await Orders.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create orders');
  }
  return result;
};

const getAllOrders = async (query: Record<string, any>) => {
  const ordersModel = new QueryBuilder(Orders.find({ isDeleted: false }), query)
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await ordersModel.modelQuery;
  const meta = await ordersModel.countTotal();

  return {
    data,
    meta,
  };
};

const getOrdersById = async (id: string) => {
  const result = await Orders.findById(id);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Orders not found!');
  }
  return result;
};

const updateOrders = async (id: string, payload: Partial<IOrders>) => {
  const result = await Orders.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Orders');
  }
  return result;
};

const assignDeliveryManInOrders = async (
  id: string,
  payload: { deliveryMan: string },
) => {
  const result = await Orders.findByIdAndUpdate(
    id,
    { deliveryMan: payload.deliveryMan },
    { new: true },
  )
    .populate('user')
    .populate('author')
    .populate('deliveryMan');

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Orders');
  }

  // Notify User
  await notificationServices.insertNotificationIntoDb({
    receiver: (result?.user as IUser)?._id,
    message: 'A delivery person has been assigned to your order.',
    description: `Delivery person ${(result?.deliveryMan as IUser)?.name || 'someone'} will deliver your order.`,
    refference: result._id,
    model_type: modeType.Orders,
  });

  // Notify Restaurant
  await notificationServices.insertNotificationIntoDb({
    receiver: (result.author as IUser)?._id,
    message: 'Delivery person assigned.',
    description: `Delivery person ${(result.deliveryMan as IUser)?.name || 'someone'} has been assigned to deliver the order.`,
    refference: result._id,
    model_type: modeType.Orders,
  });

  // Notify Delivery Man
  await notificationServices.insertNotificationIntoDb({
    receiver: (result.deliveryMan as IUser)._id,
    message: 'You have a new delivery assignment.',
    description:
      'A new order has been assigned to you for delivery. Check your dashboard for details.',
    refference: result._id,
    model_type: modeType.Orders,
  });

  return result;
};

const changeOrderStatus = async (id: string, payload: { status: string }) => {
  const order = await Orders.findById(id);
  if (!order) throw new AppError(httpStatus.BAD_REQUEST, 'Order is not found!');
  const CreatedAt = dayjs(order.createdAt).utc().toString();

  const endTime = isAfter(dayjs().utc().toString(), subMinutes(CreatedAt, 5));

  if (endTime) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cancellation not allowed within 5 minutes ',
    );
  }

  const result = await Orders.findByIdAndUpdate(
    id,
    { status: payload.status },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Orders');
  }

  switch (payload.status) {
    case ORDER_STATUS.accepted:
      // Notify User
      await notificationServices.insertNotificationIntoDb({
        receiver: result.user,
        message: 'Your order has been accepted!',
        description: 'The restaurant is preparing your order.',
        refference: result._id,
        model_type: modeType.Orders,
      });

      // Notify Restaurant
      await notificationServices.insertNotificationIntoDb({
        receiver: result.author,
        message: 'You accepted an order.',
        description:
          'The order has been marked as accepted and is being prepared.',
        refference: result._id,
        model_type: modeType.Orders,
      });
      break;

    case ORDER_STATUS.onTheWay:
      // Notify User
      await notificationServices.insertNotificationIntoDb({
        receiver: result.user,
        message: 'Your order is on the way!',
        description: 'The delivery person is heading to your location.',
        refference: result._id,
        model_type: modeType.Orders,
      });

      // Notify Restaurant
      await notificationServices.insertNotificationIntoDb({
        receiver: result.author,
        message: 'Order is on the way.',
        description: 'The order has left for delivery.',
        refference: result._id,
        model_type: modeType.Orders,
      });
      break;

    case ORDER_STATUS.delivered:
      // Notify User
      await notificationServices.insertNotificationIntoDb({
        receiver: result.user,
        message: 'Your order has been delivered!',
        description: 'Enjoy your meal! Thank you for ordering with us.',
        refference: result._id,
        model_type: modeType.Orders,
      });

      // Notify Restaurant
      await notificationServices.insertNotificationIntoDb({
        receiver: result.author,
        message: 'Order has been delivered.',
        description: 'The order was successfully delivered to the customer.',
        refference: result._id,
        model_type: modeType.Orders,
      });
      break;

    case ORDER_STATUS.canceled:
      // Notify User
      await notificationServices.insertNotificationIntoDb({
        receiver: result.user,
        message: 'Your order has been canceled.',
        description:
          "We're sorry, your order has been canceled. Please contact support if needed.",
        refference: result._id,
        model_type: modeType.Orders,
      });

      // Notify Restaurant
      await notificationServices.insertNotificationIntoDb({
        receiver: result.author,
        message: 'Order has been canceled.',
        description:
          'The customer has canceled the order. Please review the order details.',
        refference: result._id,
        model_type: modeType.Orders,
      });
      break;
  }

  return result;
};

const cancelOrderOrders = async (id: string) => {
  const result = await Orders.findByIdAndUpdate(
    id,
    { status: ORDER_STATUS.canceled },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Orders');
  }
  notificationServices.insertNotificationIntoDb({
    receiver: result.user,
    message: 'Your order has been canceled',
    description:
      "We're sorry, your recent order has been canceled. Please contact support for more details.",
    refference: result?._id,
    model_type: modeType.Orders,
  });
  notificationServices.insertNotificationIntoDb({
    receiver: result.author,
    message: 'An order has been canceled.',
    description:
      'A user has canceled their order. Check the order details for more information.',
    refference: result?._id,
    model_type: modeType.Orders,
  });
  return result;
};

const deleteOrders = async (id: string) => {
  const result = await Orders.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete orders');
  }
  return result;
};

export const ordersService = {
  createOrders,
  getAllOrders,
  getOrdersById,
  updateOrders,
  deleteOrders,
  cancelOrderOrders,
  changeOrderStatus,
  assignDeliveryManInOrders,
};
