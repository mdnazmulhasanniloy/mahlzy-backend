import { Router } from 'express';
import { addOneController } from './addOne.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post('/', auth(USER_ROLE.restaurant), addOneController.createAddOne);
router.patch(
  '/:id',
  auth(USER_ROLE.restaurant, USER_ROLE.admin),
  addOneController.updateAddOne,
);
router.delete(
  '/:id',
  auth(USER_ROLE.restaurant, USER_ROLE.admin),
  addOneController.deleteAddOne,
);
router.get(
  '/my-addone',
  auth(USER_ROLE.restaurant),
  addOneController.getMyAddOne,
);

router.get('/resturant/:userId', addOneController.getResturantAddOne);

router.get('/:id', addOneController.getAddOneById);

export const addOneRoutes = router;
