import { model, Schema, Types } from 'mongoose';
import { IPayments, IPaymentsModules } from './payments.interface';
import { PAYMENT_STATUS } from './payments.constants';
import generateCryptoString from '../../utils/generateCryptoString';

const paymentsSchema = new Schema<IPayments>(
  {
    id: {
      type: String,
      default: () => `ORDER-${generateCryptoString(10)}`,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: Types.ObjectId,
      ref: 'Orders',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: PAYMENT_STATUS,
      default: PAYMENT_STATUS.pending,
    },
    isTransfer: { type: Boolean, default: false },
    tranId: { type: String, default: null },
    chId: { type: String, default: null },
    transferAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Payments = model<IPayments, IPaymentsModules>('Payments', paymentsSchema);
export default Payments;
