import prisma from 'config/db.config';
import { NotFoundException } from 'exceptions/notFound';

import { ErrorCodes } from 'exceptions/root';
import { Request, Response } from 'express';

export const listUsers = async (req: Request, res: Response) => {
  const usersList = await prisma.user.findMany({
    skip: +req.query.skip || 0,
    take: 5,
  });
  res.json(usersList);
};
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        addresses: true,
      },
    });
    res.json(user);
  } catch (err) {
    throw new NotFoundException('User not found!', ErrorCodes.USER_NOT_FOUND);
  }
};
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        role: req.body.role,
      },
    });
    res.json(user);
  } catch (err) {
    throw new NotFoundException('User not found!', ErrorCodes.USER_NOT_FOUND);
  }
};
