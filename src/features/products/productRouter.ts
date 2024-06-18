import { errorHandler } from 'errorHandler';
import { Router } from 'express';

import authMiddleware from 'middlewares/auth';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  searchProducts,
  updateProduct,
} from './productController';
import adminMiddleware from 'middlewares/admin';

const productRoutes: Router = Router();

productRoutes.post('/addProduct', [authMiddleware, adminMiddleware], errorHandler(createProduct));
productRoutes.put('/updateProduct/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct));
productRoutes.delete('/delete/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));
productRoutes.get('/getProductList', [authMiddleware, adminMiddleware], errorHandler(listProducts));
productRoutes.get('/searchProduct', [authMiddleware], errorHandler(searchProducts));
productRoutes.get('/getProductById/:id', [authMiddleware, adminMiddleware], errorHandler(getProductById));

export default productRoutes;
