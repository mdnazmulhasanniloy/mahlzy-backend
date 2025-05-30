
import { model, Schema } from 'mongoose';
import { IStripe, IStripeModules } from './stripe.interface';

const stripeSchema = new Schema<IStripe>(
  {
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);


const Stripe = model<IStripe, IStripeModules>(
  'Stripe',
  stripeSchema
);
export default Stripe;