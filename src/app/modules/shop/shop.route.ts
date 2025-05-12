import { Router } from 'express';
import { shopController } from './shop.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

// router.post('/', shopController.createShop);
router.patch(
  '/update-my-shop',
  auth(USER_ROLE.admin),
  shopController.updateMyShop,
);
router.patch('/:id', auth(USER_ROLE.admin), shopController.updateShop);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.restaurant),
  shopController.deleteShop,
);
router.get(
  '/my-shop',
  auth(USER_ROLE.admin, USER_ROLE.restaurant),
  shopController.getMyShop,
);
router.get('/:id', shopController.getShopById);
router.get('/', shopController.getAllShop);

export const shopRoutes = router;
