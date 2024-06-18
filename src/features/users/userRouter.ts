import { errorHandler } from 'errorHandler';
import { Router } from 'express';
import adminMiddleware from 'middlewares/admin';
import authMiddleware from 'middlewares/auth';
import { listUsers, getUserById, updateUserRole } from './userController';

const userRoutes: Router = Router();

userRoutes.put('/updateRole/:id', [authMiddleware, adminMiddleware], errorHandler(updateUserRole));
userRoutes.get('/listUsers', [authMiddleware, adminMiddleware], errorHandler(listUsers));
userRoutes.get('/getUserById/:id', [authMiddleware, adminMiddleware], errorHandler(getUserById));

export default userRoutes;
