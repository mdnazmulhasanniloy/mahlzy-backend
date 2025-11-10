import { Router } from 'express';
import { couponCodeController } from './couponCode.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.restaurant),
  couponCodeController.createCouponCode,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.restaurant),
  couponCodeController.updateCouponCode,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.restaurant),
  couponCodeController.deleteCouponCode,
);

router.get(
  '/get-by-code/:codeId',

  couponCodeController.getCouponCodeByCode,
);
router.get(
  '/resturant-code/:resturantId',
  couponCodeController.getByResturantId,
);
router.get('/:id', couponCodeController.getCouponCodeById);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  couponCodeController.getAllCouponCode,
);

export const couponCodeRoutes = router;
