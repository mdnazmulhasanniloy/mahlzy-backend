import { Router } from 'express';
import { ordersController } from './orders.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';

const router = Router();

router.post('/', auth(USER_ROLE.user), ordersController.createOrders);
router.patch(
  '/assign-delivery-man/:id',
  auth(USER_ROLE.restaurant),
  ordersController.assignDeliveryManInOrders,
);
router.patch(
  '/change-status/:id',
  auth(USER_ROLE.restaurant),
  ordersController.changeOrderStatus,
);
router.patch(
  '/cancel/:id',
  auth(USER_ROLE.user),
  ordersController.cancelOrderOrders,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  ordersController.updateOrders,
);
router.delete('/:id', ordersController.deleteOrders);
router.get(
  '/my-shop-orders',
  auth(USER_ROLE.restaurant),
  ordersController.getShopOrders,
);
router.get('/my-orders', auth(USER_ROLE.user), ordersController.getMyOrders);
router.get(
  '/delivery-man-orders',
  auth(USER_ROLE.delivery_man),
  ordersController.getDeliveryManOrders,
);
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.restaurant,
    USER_ROLE.delivery_man,
    USER_ROLE.user,
  ),
  ordersController.getOrdersById,
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  ordersController.getAllOrders,
);

export const ordersRoutes = router;
