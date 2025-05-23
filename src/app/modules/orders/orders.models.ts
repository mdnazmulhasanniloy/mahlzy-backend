
import { model, Schema } from 'mongoose';
import { IOrders, IOrdersModules } from './orders.interface';

const ordersSchema = new Schema<IOrders>(
  {
   
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);


const Orders = model<IOrders, IOrdersModules>(
  'Orders',
  ordersSchema
);
export default Orders;