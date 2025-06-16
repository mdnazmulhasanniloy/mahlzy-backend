import { Router } from 'express';
import { toppingController } from './topping.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE.restaurant),
  upload.single('image'),
  parseData(),
  toppingController.createTopping,
);
router.patch(
  '/:id',
  auth(USER_ROLE.restaurant, USER_ROLE.admin),
  upload.single('image'),
  parseData(),
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
