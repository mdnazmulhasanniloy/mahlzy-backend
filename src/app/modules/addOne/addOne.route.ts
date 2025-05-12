
import { Router } from 'express';
import { addOneController } from './addOne.controller';

const router = Router();

router.post('/', addOneController.createAddOne);
router.patch('/:id', addOneController.updateAddOne);
router.delete('/:id', addOneController.deleteAddOne);
router.get('/:id', addOneController.getAddOneById);
router.get('/', addOneController.getAllAddOne);

export const addOneRoutes = router;