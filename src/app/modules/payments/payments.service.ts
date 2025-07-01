import httpStatus from 'http-status';
import { IPayments } from './payments.interface';
import Payments from './payments.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import generateCryptoString from '../../utils/generateCryptoString';
import Orders from '../orders/orders.models';
import { IOrders } from '../orders/orders.interface';
import { PAYMENT_STATUS } from './payments.constants';
import { User } from '../user/user.models';
import { USER_ROLE } from '../user/user.constants';
import { ObjectId, startSession, Types } from 'mongoose';
import StripeService from '../../class/stripe';
import config from '../../config';
import { ORDER_STATUS } from '../orders/orders.constants';
import { notificationServices } from '../notification/notification.service';
import { IUser } from '../user/user.interface';
import { modeType } from '../notification/notification.interface';
import { IProducts } from '../products/products.interface';

const checkout = async (payload: IPayments) => {
  const tranId = generateCryptoString(10);
  let paymentData: IPayments;

  const order: IOrders | null = await Orders?.findById(payload?.order).populate(
    'orderItems.product',
  );
  console.log("🚀 ~ checkout ~ order:", order)

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order Not Found!');
  }

  const isExistPayment: IPayments | null = await Payments.findOne({
    order: payload?.order,
    status: PAYMENT_STATUS.pending,
    user: payload?.user,
  });

  if (isExistPayment) {
    const payment = await Payments.findByIdAndUpdate(
      isExistPayment?._id,
      { tranId },
      { new: true },
    );

    paymentData = payment as IPayments;
  } else {
    const orderCharge = await User.findOne({ role: USER_ROLE.admin }).then(
      admin => (admin?.orderCharge ? admin?.orderCharge : 0),
    );
    // if (!admin)
    //   throw new AppError(httpStatus.BAD_REQUEST, 'server internel Error');

    payload.tranId = tranId;
    payload.author = order?.author as ObjectId;
    payload.amount = Math.round(Number(order.totalPrice) + Number(orderCharge)); 
    console.log(payload)
    const createdPayment = await Payments.create(payload);

    if (!createdPayment) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create payment',
      );
    }
    paymentData = createdPayment;
  }

  if (!paymentData)
    throw new AppError(httpStatus.BAD_REQUEST, 'payment not found');

  const product = {
    amount: Number(paymentData?.amount),
    //@ts-ignore
    name: (order?.orderItems[0]?.product as IProducts)?.name ?? 'A Foods',
    quantity: Number(order?.orderItems[0]?.quantity) ?? 1,
  };
  let customerId;
  const user = await User.IsUserExistId(paymentData?.user?.toString());
  if (user?.customerId) {
    customerId = user?.customerId;
  } else {
    const customer = await StripeService.createCustomer(
      user?.email,
      user?.name,
    );
    customerId = customer?.id;
  }

  const success_url = `${config.server_url}/payments/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&paymentId=${paymentData?._id}`;

  const cancel_url = `${config.server_url}/payments/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&paymentId=${paymentData?._id}`;
  console.log({
    product,
    success_url,
    cancel_url,
    customerId,
  });
  const checkoutSession = await StripeService.getCheckoutSession(
    product,
    success_url,
    cancel_url,
    customerId,
  );

  return checkoutSession?.url;
};

const confirmPayment = async (query: Record<string, any>) => {
  const { sessionId, paymentId } = query;
  const session = await startSession();
  const PaymentSession = await StripeService.getPaymentSession(sessionId);
  const paymentIntentId = PaymentSession.payment_intent as string;

  if (!(await StripeService.isPaymentSuccess(sessionId))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment session is not completed',
    );
  }

  try {
    session.startTransaction();
    const payment = await Payments.findByIdAndUpdate(
      paymentId,
      { status: PAYMENT_STATUS?.paid, paymentIntentId: paymentIntentId },
      { new: true, session },
    ).populate([
      { path: 'user', select: 'name _id email phoneNumber profile ' },
      { path: 'author', select: 'name _id email phoneNumber profile' },
    ]);

    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found!');
    }
    const order = await Orders.findByIdAndUpdate(
      payment?.order,
      {
        paymentStatus: PAYMENT_STATUS?.paid,
        status: ORDER_STATUS?.ongoing,
        tranId: payment?.tranId,
      },
      { new: true, session },
    );

    // const admin = await User.findOne({ role: USER_ROLE.admin });

    notificationServices.insertNotificationIntoDb({
      receiver: (payment?.user as IUser)?._id,
      message: 'Payment Successful',
      description: `Your payment for the Order #"${order && order.id}" was successful.`,
      reference: payment?._id,
      model_type: modeType.Payments,
    });

    // For Restaurant (Seller)
    notificationServices.insertNotificationIntoDb({
      receiver: (payment?.author as IUser)?._id,
      message: 'New Payment Received',
      description: `You have received a payment for the Order #"${order && order.id}".`,
      reference: payment?._id,
      model_type: modeType.Payments,
    });

    await session.commitTransaction();
    return payment;
  } catch (error: any) {
    await session.abortTransaction();

    if (paymentIntentId) {
      try {
        await StripeService.refund(paymentId);
        //  stripe.refunds.create({
        //   payment_intent: paymentIntentId,
        // });
      } catch (refundError: any) {
        console.error('Error processing refund:', refundError.message);
      }
    }

    throw new AppError(httpStatus.BAD_GATEWAY, error.message);
  } finally {
    session.endSession();
  }
};

const createPayments = async (payload: IPayments) => {
  const result = await Payments.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create payments');
  }
  return result;
};

const getAllPayments = async (query: Record<string, any>) => {
  const paymentsModel = new QueryBuilder(
    Payments.find({ isDeleted: false }),
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await paymentsModel.modelQuery;
  const meta = await paymentsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getPaymentsById = async (id: string) => {
  const result = await Payments.findById(id);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payments not found!');
  }
  return result;
};

const updatePayments = async (id: string, payload: Partial<IPayments>) => {
  const result = await Payments.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Payments');
  }
  return result;
};

const deletePayments = async (id: string) => {
  const result = await Payments.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete payments');
  }
  return result;
};

export const paymentsService = {
  createPayments,
  getAllPayments,
  getPaymentsById,
  updatePayments,
  deletePayments,
  checkout,
  confirmPayment,
};
