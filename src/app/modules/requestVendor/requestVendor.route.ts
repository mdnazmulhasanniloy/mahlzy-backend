import { Router } from 'express';
import { requestVendorController } from './requestVendor.controller';
import validateRequest from '../../middleware/validateRequest';
import { vendorRequestValidation } from './requestVendor.validation';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  upload.single('image'),
  parseData(),
  validateRequest(vendorRequestValidation.createSchema),

  requestVendorController.createRequestVendor,
);

router.patch(
  '/approve/:id',
  auth(USER_ROLE.admin),
  requestVendorController.approvedRequest,
);

router.patch(
  '/reject/:id',
  auth(USER_ROLE.admin),
  validateRequest(vendorRequestValidation.rejectSchema),
  requestVendorController.rejectRequestVendor,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(vendorRequestValidation.updateSchema),
  requestVendorController.updateRequestVendor,
);


router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(vendorRequestValidation.updateSchema),
  requestVendorController.updateRequestVendor,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  requestVendorController.deleteRequestVendor,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin),
  requestVendorController.getRequestVendorById,
);

router.get(
  '/',
  auth(USER_ROLE.admin),
  requestVendorController.getAllRequestVendor,
);

export const requestVendorRoutes = router;
