import { Router } from 'express';
import { shopController } from './shop.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import multer, { memoryStorage } from 'multer';
import { uploadManyToS3 } from './../../utils/s3';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

// router.post('/', shopController.createShop);

router.patch(
  '/my-shop',
  auth(USER_ROLE.restaurant),
  upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]),
  parseData(),
  shopController.updateMyShop,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]),
  parseData(),
  shopController.updateShop,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.restaurant),
  shopController.deleteShop,
);

router.get('/my-shop', auth(USER_ROLE.restaurant), shopController.getMyShop);
router.get('/:id', shopController.getShopById);
router.get('/', shopController.getAllShop);

export const shopRoutes = router;
