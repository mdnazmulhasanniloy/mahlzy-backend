import { model, Schema } from 'mongoose';
import { IOrders, IOrdersModules } from './orders.interface';
import generateCryptoString from '../../utils/generateCryptoString';

const ordersSchema = new Schema<IOrders>(
  {
    id: {
      type: String,
      default: () => generateCryptoString(10),
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
      enum: ['pending', 'paid', 'pickup'],
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
          ref: 'Product',
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
    additionalItems: [
      {
        topping: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
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
      required: true,
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
    billingDetails: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      zip: {
        type: String,
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
