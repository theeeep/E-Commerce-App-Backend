import { Router } from 'express';
import authRoutes from 'features/auth/authRouter';
import cartRoutes from 'features/cart/cartRouter';
import orderRoutes from 'features/orders/orderRouter';
import productRoutes from 'features/products/productRouter';
import userAddressRoutes from 'features/userAddress/addressRouter';
import userRoutes from 'features/users/userRouter';

const rootRouter: Router = Router();

// User Auth Routes
rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productRoutes);
rootRouter.use('/userAddress', userAddressRoutes);
rootRouter.use('/users', userRoutes); //? --->User Address Routes
rootRouter.use('/carts', cartRoutes); //? ---> Address Routes
rootRouter.use('/orders', orderRoutes); //? ---> Address Routes

export default rootRouter;
