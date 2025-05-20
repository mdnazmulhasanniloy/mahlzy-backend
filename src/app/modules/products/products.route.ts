
import { Router } from 'express';
import { productsController } from './products.controller';

const router = Router();

router.post('/', productsController.createProducts);
router.patch('/:id', productsController.updateProducts);
router.delete('/:id', productsController.deleteProducts);
router.get('/:id', productsController.getProductsById);
router.get('/', productsController.getAllProducts);

export const productsRoutes = router;