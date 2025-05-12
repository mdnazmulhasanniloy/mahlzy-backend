import z from 'zod';
import { shopWiseCuisinesController } from './shopWiseCuisines.controller';

const createSchema = z.object({
  body: z.object({
    cuisines: z.string({ required_error: 'cuisines id is required' }),
  }),
});


export const shopWiseCuisinesValidation = {
  createSchema,
};