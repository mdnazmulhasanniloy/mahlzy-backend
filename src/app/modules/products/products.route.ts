import { Router } from 'express';
import { productsController } from './products.controller';
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
  upload.fields([{ name: 'images', maxCount: 5 }]),
  parseData(),
  productsController.createProducts,
);

router.patch(
  '/:id',
  auth(USER_ROLE.restaurant, USER_ROLE.admin),
  upload.fields([{ name: 'images', maxCount: 5 }]),
  parseData(),
  productsController.updateProducts,
);

router.delete(
  '/:id',
  auth(USER_ROLE.restaurant, USER_ROLE.admin),
  productsController.deleteProducts,
);

router.get(
  '/my-products',
  auth(USER_ROLE.restaurant),
  productsController.getMyProducts,
);
router.get(
  '/restaurant-wise-products/:shopId',
  productsController.getShopWiseProducts,
);
router.get('/:id', productsController.getProductsById);
router.get('/', productsController.getAllProducts);

export const productsRoutes = router;
