import { z } from 'zod';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const createSchema = z.object({
  body: z.object({
    businessName: z.string().min(1, { message: 'Business name is required' }),
    userName: z.string().min(1, { message: 'User name is required' }),
    businessEmail: z
      .string()
      .email({ message: 'Invalid email format' })
      .min(1, { message: 'Business email is required' }),
    phoneNumber: z
      .string()
      .min(1, { message: 'Business phone number is required' }),
    businessAddress: z
      .string()
      .min(1, { message: 'Business address is required' }),
  }),
});

const updateSchema = z.object({
  body: z
    .object({
      businessName: z.string().min(1, { message: 'Business name is required' }),
      userName: z.string().min(1, { message: 'User name is required' }),
      businessEmail: z
        .string()
        .email({ message: 'Invalid email format' })
        .min(1, { message: 'Business email is required' }),
      phoneNumber: z
        .string()
        .min(1, { message: 'Business phone number is required' }),
      businessAddress: z
        .string()
        .min(1, { message: 'Business address is required' }),
    })
    .deepPartial(),
});

const rejectSchema = z.object({
  body: z.object({
    reason: z.string().min(1, { message: 'Reason is required' }),
  }),
});
export const vendorRequestValidation = {
  createSchema,
  updateSchema,
  rejectSchema,
};
