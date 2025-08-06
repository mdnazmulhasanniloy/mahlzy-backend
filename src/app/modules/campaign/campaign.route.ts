import { Router } from 'express';
import { campaignController } from './campaign.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';

const router = Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  upload.single('banner'),
  parseData(),
  auth(USER_ROLE.restaurant),
  campaignController.createCampaign,
);
router.patch(
  '/:id',
  auth(USER_ROLE.restaurant),
  upload.single('banner'),
  parseData(),
  campaignController.updateCampaign,
);
router.delete(
  '/:id',
  auth(
    USER_ROLE.restaurant,
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.sub_admin,
  ),
  campaignController.deleteCampaign,
);
router.get(
  '/my-campaign',
  auth(USER_ROLE.restaurant),
  campaignController.getMyCampaign,
);
router.get('/:id', campaignController.getCampaignById);
router.get('/', campaignController.getAllCampaign);

export const campaignRoutes = router;
