import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { notificationRoutes } from '../modules/notification/notificaiton.route';
import { contentsRoutes } from '../modules/contents/contents.route';
import { requestVendorRoutes } from '../modules/requestVendor/requestVendor.route';
import { categoryRoutes } from '../modules/category/category.route';
import { cuisinesRoutes } from '../modules/cuisines/cuisines.route';
import { shopWiseCuisinesRoutes } from '../modules/shopWiseCuisines/shopWiseCuisines.route';
import { deliveryManRoutes } from '../modules/deliveryMan/deliveryMan.route';
import { toppingRoutes } from '../modules/topping/topping.route';
import { couponCodeRoutes } from '../modules/couponCode/couponCode.route';

const router = Router();
const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/contents',
    route: contentsRoutes,
  },
  {
    path: '/request-for-resturant',
    route: requestVendorRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/cuisines',
    route: cuisinesRoutes,
  },
  {
    path: '/shop-cuisines',
    route: shopWiseCuisinesRoutes,
  },
  {
    path: '/delivery-man',
    route: deliveryManRoutes,
  },
  {
    path: '/delivery-man',
    route: deliveryManRoutes,
  },
  {
    path: '/toppings',
    route: toppingRoutes,
  },
  {
    path: '/coupon-codes',
    route: couponCodeRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
