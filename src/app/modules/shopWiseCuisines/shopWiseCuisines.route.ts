import { Router } from 'express';
import { shopWiseCuisinesController } from './shopWiseCuisines.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import { shopWiseCuisinesValidation } from './shopWiseCuisines.validation';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.restaurant),
  validateRequest(shopWiseCuisinesValidation.createSchema),
  shopWiseCuisinesController.createShopWiseCuisines,
);
router.patch(
  '/:id',
  auth(USER_ROLE.restaurant, USER_ROLE.admin),
  shopWiseCuisinesController.updateShopWiseCuisines,
);
router.delete(
  '/:id',
  auth(USER_ROLE.restaurant, USER_ROLE.admin),
  shopWiseCuisinesController.deleteShopWiseCuisines,
);
router.get(
  '/my-shop-cuisines',
  auth(USER_ROLE.restaurant),
  shopWiseCuisinesController.getMyShopWiseCuisines,
);

router.get('/:id', shopWiseCuisinesController.getShopWiseCuisinesById);
router.get('/', shopWiseCuisinesController.getAllShopWiseCuisines);

export const shopWiseCuisinesRoutes = router;
