
import { Router } from 'express';
import { documentsController } from './documents.controller';

const router = Router();

router.post('/', documentsController.createDocuments);
router.patch('/:id', documentsController.updateDocuments);
router.delete('/:id', documentsController.deleteDocuments);
router.get('/:id', documentsController.getDocumentsById);
router.get('/', documentsController.getAllDocuments);

export const documentsRoutes = router;