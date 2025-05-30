
import { Model } from 'mongoose';

export interface IStripe {}

export type IStripeModules = Model<IStripe, Record<string, unknown>>;