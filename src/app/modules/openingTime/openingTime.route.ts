import { Router } from 'express';
import { openingTimeController } from './openingTime.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.restaurant),
  openingTimeController.createOpeningTime,
);
router.patch(
  '/:id',
  auth(USER_ROLE.restaurant),
  openingTimeController.updateOpeningTime,
);
router.delete(
  '/:id',
  auth(USER_ROLE.restaurant, USER_ROLE.admin),
  openingTimeController.deleteOpeningTime,
);
router.get(
  '/resturant/:id',
  openingTimeController.getResturantOpeningTimeById,
);
router.get('/:id', openingTimeController.getOpeningTimeById);
router.get('/', openingTimeController.getAllOpeningTime);

export const openingTimeRoutes = router;
