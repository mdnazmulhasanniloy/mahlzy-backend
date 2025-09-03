
import { Router } from 'express';
import { attributeController } from './attribute.controller';

const router = Router();

router.post('/', attributeController.createAttribute);
router.patch('/:id', attributeController.updateAttribute);
router.delete('/:id', attributeController.deleteAttribute);
router.get('/:id', attributeController.getAttributeById);
router.get('/', attributeController.getAllAttribute);

export const attributeRoutes = router;