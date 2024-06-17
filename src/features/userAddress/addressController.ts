import { Address } from '@prisma/client';
import prisma from 'config/db.config';
import { BadRequestsException } from 'exceptions/badRequests';
import { NotFoundException } from 'exceptions/notFound';

import { ErrorCodes } from 'exceptions/root';
import { Request, Response } from 'express';
import { AddressSchema, UpdateUserAddressSchema } from 'schema/users.schema';

// ? ---> Add Address
export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);
  const address = await prisma.address.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.json(address);
};

// ? ---> Delete Address
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prisma.address.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.status(200).json({ message: 'Address Deleted Successfully' });
  } catch (err) {
    throw new NotFoundException('Address not found!', ErrorCodes.ADDRESS_NOT_FOUND);
  }
};

// ? ---> List Address
export const listAddress = async (req: Request, res: Response) => {
  const addresses = await prisma.address.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.status(200).json(addresses);
};

// ? ---> Update Address
export const updateAddress = async (req: Request, res: Response) => {
  const validatedData = UpdateUserAddressSchema.parse(req.body);

  let shippingAddress: Address;
  let billingAddress: Address;

  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prisma.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddress,
        },
      });
    } catch (err) {
      throw new NotFoundException('Shipping Address not found!', ErrorCodes.ADDRESS_NOT_FOUND);
    }
    if (shippingAddress.userId != req.user.id) {
      throw new BadRequestsException('Addres does not belongs to user', ErrorCodes.ADDRESS_DOES_NOT_BELONG, 400);
    }
  }
  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prisma.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddress,
        },
      });
    } catch (err) {
      throw new NotFoundException('Billing Address not found!', ErrorCodes.ADDRESS_NOT_FOUND);
    }
    if (billingAddress.userId != req.user.id) {
      throw new BadRequestsException('Addres does not belongs to user', ErrorCodes.ADDRESS_DOES_NOT_BELONG, 400);
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: validatedData,
  });
  res.json(updatedUser);
};
