import { Router } from 'express';
import { deliveryManController } from './deliveryMan.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.restaurant),
  deliveryManController.createDeliveryMan,
);

router.patch(
  '/:id',
  auth(USER_ROLE.restaurant, USER_ROLE.admin, USER_ROLE.delivery_man),
  deliveryManController.updateDeliveryMan,
);
router.delete(
  '/:id',
  auth(USER_ROLE.restaurant, USER_ROLE.admin),
  deliveryManController.deleteDeliveryMan,
);
router.get('/:id', deliveryManController.getDeliveryManById);
router.get('/', deliveryManController.getAllDeliveryMan);

export const deliveryManRoutes = router;
