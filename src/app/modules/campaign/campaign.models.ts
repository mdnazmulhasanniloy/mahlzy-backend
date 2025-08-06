import { model, Schema, Types } from 'mongoose';
import { ICampaign, ICampaignModules } from './campaign.interface';
import { string } from 'zod';

const campaignSchema = new Schema<ICampaign>(
  {
    shop: {
      type: Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    expireAt: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Campaign = model<ICampaign, ICampaignModules>('Campaign', campaignSchema);
export default Campaign;
