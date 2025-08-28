import { Router } from 'express';
import { cuisinesController } from './cuisines.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post('/', auth(USER_ROLE.restaurant), cuisinesController.createCuisines);
router.patch(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.restaurant,
  ),
  cuisinesController.updateCuisines,
);
router.delete(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.restaurant,
  ),
  cuisinesController.deleteCuisines,
);
router.get('/:id', cuisinesController.getCuisinesById);
router.get('/', cuisinesController.getAllCuisines);

export const cuisinesRoutes = router;
