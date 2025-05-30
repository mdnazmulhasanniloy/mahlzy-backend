import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { ordersService } from './orders.service';
import sendResponse from '../../utils/sendResponse';

const createOrders = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user.userId;
  const result = await ordersService.createOrders(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Orders created successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await ordersService.getAllOrders(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All orders fetched successfully',
    data: result,
  });
});

const getShopOrders = catchAsync(async (req: Request, res: Response) => {
  req.query['author'] = req.user.userId;
  const result = await ordersService.getAllOrders(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All orders fetched successfully',
    data: result,
  });
});

const getDeliveryManOrders = catchAsync(async (req: Request, res: Response) => {
  req.query['deliveryMan'] = req.user.userId;
  const result = await ordersService.getAllOrders(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All orders fetched successfully',
    data: result,
  });
});
const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  req.query['user'] = req.user.userId;
  const result = await ordersService.getAllOrders(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All orders fetched successfully',
    data: result,
  });
});

const getOrdersById = catchAsync(async (req: Request, res: Response) => {
  const result = await ordersService.getOrdersById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders fetched successfully',
    data: result,
  });
});

const updateOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await ordersService.updateOrders(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders updated successfully',
    data: result,
  });
});

const changeOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await ordersService.changeOrderStatus(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders status change successfully',
    data: result,
  });
});
const assignDeliveryManInOrders = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ordersService.assignDeliveryManInOrders(
      req.params.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'In Order delivery man assign successfully',
      data: result,
    });
  },
);

const cancelOrderOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await ordersService.cancelOrderOrders(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders cancel successfully',
    data: result,
  });
});

const deleteOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await ordersService.deleteOrders(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders deleted successfully',
    data: result,
  });
});

export const ordersController = {
  getMyOrders,
  getShopOrders,
  createOrders,
  getAllOrders,
  getOrdersById,
  updateOrders,
  deleteOrders,
  getDeliveryManOrders,
  cancelOrderOrders,
  changeOrderStatus,
  assignDeliveryManInOrders,
};
