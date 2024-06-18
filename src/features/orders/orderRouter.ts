import { Router } from 'express';
import adminMiddleware from 'middlewares/admin';
import authMiddleware from 'middlewares/auth';
import {
  cancelOrder,
  changeStatus,
  createOrder,
  getOrderById,
  listAllOrders,
  listOrders,
  userOrderSummary,
} from './orderController';
import { errorHandler } from 'errorHandler';

const orderRoutes: Router = Router();

orderRoutes.post('/checkOut', [authMiddleware], errorHandler(createOrder));
orderRoutes.get('/orderList', [authMiddleware], errorHandler(listOrders));
orderRoutes.put('/cancel/:id', [authMiddleware], errorHandler(cancelOrder));
orderRoutes.get('/index', [authMiddleware, adminMiddleware], errorHandler(listAllOrders)); // Admin Access Only
orderRoutes.put('/status/:id', [authMiddleware, adminMiddleware], errorHandler(changeStatus)); // Admin Access Only
orderRoutes.get('/getOrderById/:id', [authMiddleware], errorHandler(getOrderById));
orderRoutes.get('/user-order-summary/:id', [authMiddleware], errorHandler(userOrderSummary));

export default orderRoutes;
