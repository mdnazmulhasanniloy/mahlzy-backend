import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { dashboardService } from './dashboard.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const resturantDashboardTopCard = catchAsync(
  async (req: Request, res: Response) => {
    const result = await dashboardService.resturantDashboardTopCard(
      req?.user?.userId,
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Dashboard top card Data get successfully',
      data: result,
    });
  },
);

const resturantDashboardChart = catchAsync(
  async (req: Request, res: Response) => {
    req.query.userId = req?.user?.userId;
    const result = await dashboardService.resturantDashboardChart(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Dashboard chart data get successfully',
      data: result,
    });
  },
);
const resturantDashboardTables = catchAsync(
  async (req: Request, res: Response) => {
    req.query.userId = req?.user?.userId;
    const result = await dashboardService.resturantDashboardTables(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Dashboard tables fetched successfully',
      data: result,
    });
  },
);
const resturantCustomerList = catchAsync(
  async (req: Request, res: Response) => {
    req.query.userId = req?.user?.userId;
    const result = await dashboardService.resturantCustomerList(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Dashboard resturant customer fetched successfully',
      data: result,
    });
  },
);

export const dashboardController = {
  resturantDashboardTopCard,
  resturantDashboardChart,
  resturantDashboardTables,
  resturantCustomerList,
};
