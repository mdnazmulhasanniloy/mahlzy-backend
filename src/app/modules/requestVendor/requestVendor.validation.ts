import { z } from 'zod';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const createSchema = z.object({
  file: z
    .instanceof(File) // Ensures the file is a valid file object (like in form data)
    .refine(
      file => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        return allowedTypes.includes(file.type); // Check image type (MIME type)
      },
      {
        message: 'Invalid image type. Only JPEG, PNG and WEBP are allowed.',
      },
    )
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `Image file is too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
    }),

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
  file: z
    .instanceof(File) // Ensures the file is a valid file object (like in form data)
    .refine(
      file => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        return allowedTypes.includes(file.type); // Check image type (MIME type)
      },
      {
        message: 'Invalid image type. Only JPEG, PNG and WEBP are allowed.',
      },
    )
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `Image file is too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
    }),

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
