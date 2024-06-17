import { errorHandler } from 'errorHandler';
import { Router } from 'express';
import authMiddleware from 'middlewares/auth';
import { addAddress, updateAddress, deleteAddress, listAddress } from './addressController';

const userAddressRoutes: Router = Router();

userAddressRoutes.post('/addAddress', [authMiddleware], errorHandler(addAddress));
userAddressRoutes.put('/updateAddress', [authMiddleware], errorHandler(updateAddress));
userAddressRoutes.delete('/deleteAddress/:id', [authMiddleware], errorHandler(deleteAddress));
userAddressRoutes.get('/listAddress', [authMiddleware], errorHandler(listAddress));

export default userAddressRoutes;
