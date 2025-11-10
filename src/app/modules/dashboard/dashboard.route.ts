import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.get(
  '/resturant-top-card',
  auth(USER_ROLE.restaurant),
  dashboardController.resturantDashboardTopCard,
);
router.get(
  '/resturant-chart',
  auth(USER_ROLE.restaurant),
  dashboardController.resturantDashboardChart,
);
router.get(
  '/resturant-tables',
  auth(USER_ROLE.restaurant),
  dashboardController.resturantDashboardTables,
);
router.get(
  '/resturant-customers',
  auth(USER_ROLE.restaurant),
  dashboardController.resturantCustomerList,
);

export const dashboardRoutes = router;
