import { Router } from 'express';
import { toppingController } from './topping.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';

const router = Router();

router.post('/', auth(USER_ROLE.restaurant), toppingController.createTopping);
router.patch(
  '/:id',
  auth(USER_ROLE.restaurant, USER_ROLE.admin),
  toppingController.updateTopping,
);
router.delete(
  '/:id',
  auth(USER_ROLE.restaurant, USER_ROLE.admin),
  toppingController.deleteTopping,
);
router.get(
  '/my-toppings',
  auth(USER_ROLE.restaurant),
  toppingController.getMyTopping,
);
router.get('/resturant/:shopId', toppingController.getShopTopping);
router.get('/:id', toppingController.getToppingById);
router.get('/', toppingController.getAllTopping);

export const toppingRoutes = router;
