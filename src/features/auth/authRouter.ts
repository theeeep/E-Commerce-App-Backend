import { Router } from 'express';
import { login, me, signup } from './authController';
import { errorHandler } from 'errorHandler';
import authMiddleware from 'middlewares/auth';

const authRoutes: Router = Router();

authRoutes.post('/signup', errorHandler(signup));
authRoutes.post('/login', errorHandler(login));
authRoutes.get('/me', [authMiddleware], errorHandler(me));

export default authRoutes;
