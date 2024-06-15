import { Router } from 'express';
import authRoutes from 'features/auth/authRouter';

const rootRouter: Router = Router();

// User Auth Routes
rootRouter.use('/auth', authRoutes);

export default rootRouter;
