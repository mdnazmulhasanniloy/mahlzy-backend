import { query } from 'express';
import { z } from 'zod';

// Common helpers
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

// Option item
export const optionSchema = z.object({
  name: z.string().min(1, 'Option name is required'),
  value: z.string().min(1, 'Option value is required'),
  // keep as string to match your interface, but ensure it's numeric-like
  price: z
    .string()
    .regex(
      /^-?\d+(\.\d{1,2})?$/,
      "Price must be a number string (e.g., '9.99')",
    ),
});

const attributeBaseSchema = z.object({
  product: objectId,
  type: z.enum(['input', 'number', 'radio', 'select']),
  title: z.string().min(1, 'Title is required'),
  isRequired: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
  // match your interface: an array of option objects
  options: z.array(optionSchema).default([]),
});

const createAttributeSchema = z.object({
  body: attributeBaseSchema,
});
const getAttributeSchema = z.object({
  query: z.object({
    product: z.string({ required_error: 'product id is required in query.' }),
  }),
});

export const attributeValidator = {
  getAttributeSchema,
  createAttributeSchema,
};
