import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { notificationRoutes } from '../modules/notification/notificaiton.route';
import { contentsRoutes } from '../modules/contents/contents.route';
import { requestVendorRoutes } from '../modules/requestVendor/requestVendor.route';
import { categoryRoutes } from '../modules/category/category.route';
import { cuisinesRoutes } from '../modules/cuisines/cuisines.route';
import { deliveryManRoutes } from '../modules/deliveryMan/deliveryMan.route';
import { toppingRoutes } from '../modules/topping/topping.route';
import { couponCodeRoutes } from '../modules/couponCode/couponCode.route';
import { productsRoutes } from '../modules/products/products.route';
import { ordersRoutes } from '../modules/orders/orders.route';
import stripeRoute from '../modules/stripe/stripe.route';
import { paymentsRoutes } from '../modules/payments/payments.route';
import { shopRoutes } from '../modules/shop/shop.route';
import { reviewsRoutes } from '../modules/reviews/reviews.route';

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
  {
    path: '/products',
    route: productsRoutes,
  },
  {
    path: '/orders',
    route: ordersRoutes,
  },
  {
    path: '/stripe',
    route: stripeRoute,
  },
  {
    path: '/payments',
    route: paymentsRoutes,
  },
  {
    path: '/shop',
    route: shopRoutes,
  },
  {
    path: '/review',
    route: reviewsRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
