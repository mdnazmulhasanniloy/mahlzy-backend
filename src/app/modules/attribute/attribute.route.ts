import { Router } from 'express';
import { attributeController } from './attribute.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import { attributeValidator } from './attribute.validation';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.restaurant),
  validateRequest(attributeValidator.createAttributeSchema),
  attributeController.createAttribute,
);
router.patch(
  '/:id',
  auth(USER_ROLE.restaurant),
  attributeController.updateAttribute,
);
router.delete(
  '/:id',
  auth(USER_ROLE.restaurant),
  attributeController.deleteAttribute,
);
router.get('/:id', attributeController.getAttributeById);
router.get(
  '/',
  validateRequest(attributeValidator.getAttributeSchema),
  attributeController.getAllAttribute,
);

export const attributeRoutes = router;
