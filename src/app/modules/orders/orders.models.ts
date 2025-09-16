import { model, Schema } from 'mongoose';
import { IOrders, IOrdersModules } from './orders.interface';
import generateCryptoString from '../../utils/generateCryptoString';

const ordersSchema = new Schema<IOrders>(
  {
    id: {
      type: String,
      default: () => `ORDER-${generateCryptoString(10)}`,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    coupon: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'accepted',
        'ongoing',
        'onTheWay',
        'delivered',
        'canceled',
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'pickup', 'cash_on_delivery'],
      default: 'pending',
    },

    trnId: {
      type: String,
      default: null,
    },
    orderItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Products',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        additionalDetails: {
          type: String,
          default: null,
        },
      },
    ],

    additionalItems: [
      {
        topping: {
          type: Schema.Types.ObjectId,
          ref: 'Topping',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    deliveryMan: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deliveryLocation: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (v: number[]) => v.length === 2,
          message:
            'Coordinates must be an array of two numbers [longitude, latitude]',
        },
      },
    },
    comment: {
      type: String,
      default: null,
    },
    billingDetails: {
      name: {
        type: String,
        default: null,
      },
      email: {
        type: String,
        default: null,
      },
      phone: {
        type: String,
        default: null,
      },
      address: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
      country: {
        type: String,
        default: null,
      },
      zip: {
        type: String,
        default: null,
      },
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Orders = model<IOrders, IOrdersModules>('Orders', ordersSchema);
export default Orders;
