import { errorHandler } from 'errorHandler';
import { Router } from 'express';
import authMiddleware from 'middlewares/auth';
import { addItemToCart, getCart, deleteItemFromCart, changeQuantity } from './cartController';

const cartRoutes: Router = Router();

cartRoutes.post('/addToCart', [authMiddleware], errorHandler(addItemToCart));
cartRoutes.get('/getCart', [authMiddleware], errorHandler(getCart));
cartRoutes.delete('/delete/:id', [authMiddleware], errorHandler(deleteItemFromCart));
cartRoutes.put('/updateCart/:id', [authMiddleware], errorHandler(changeQuantity));

export default cartRoutes;
