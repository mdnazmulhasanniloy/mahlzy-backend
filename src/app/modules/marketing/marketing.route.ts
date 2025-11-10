import { Router } from 'express';
import { marketingController } from './marketing.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.restaurant),
  marketingController.createMarketing,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  marketingController.updateMarketing,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  marketingController.deleteMarketing,
);
router.get(
  '/my-marketing',
  auth(USER_ROLE.restaurant),
  marketingController.getMyMarketing,
);
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.restaurant,
  ),
  marketingController.getMarketingById,
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  marketingController.getAllMarketing,
);

export const marketingRoutes = router;
