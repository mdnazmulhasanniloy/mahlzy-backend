import { IProducts } from './../products/products.interface';

import { model, Schema } from 'mongoose';
import { IAttribute, IAttributeModules, IOptions } from './attribute.interface';

const OptionsSchema = new Schema<IOptions>({
  name: { type: String, required: true },
  value: { type: String, required: true },
  price: { type: String, default: null },
});

const attributeSchema = new Schema<IAttribute>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Products', required: true },
    type: {
      type: String,
      enum: ['input', 'number', 'radio', 'select'],
      required: true,
    },
    title: { type: String, required: true },
    isRequired: { type: Boolean, default: false },
    placeholder: { type: String, default: null },
    options: { type: [OptionsSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

const Attribute = model<IAttribute, IAttributeModules>(
  'Attribute',
  attributeSchema,
);
export default Attribute;
