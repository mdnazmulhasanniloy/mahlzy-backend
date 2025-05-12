
import { Router } from 'express';
import { couponCodeController } from './couponCode.controller';

const router = Router();

router.post('/', couponCodeController.createCouponCode);
router.patch('/:id', couponCodeController.updateCouponCode);
router.delete('/:id', couponCodeController.deleteCouponCode);
router.get('/:id', couponCodeController.getCouponCodeById);
router.get('/', couponCodeController.getAllCouponCode);

export const couponCodeRoutes = router;