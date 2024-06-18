import { config } from 'config/config';
import prisma from 'config/db.config';
import { ErrorCodes } from 'exceptions/root';
import { UnauthorizedException } from 'exceptions/unauthorized';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  //* 1. extract token from header
  const token = req.header('Authorization');
  console.log(token);

  //* 2. if token is not present, throw an error of unauthorized
  if (!token) {
    next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
  }

  try {
    //* 3. if token is present, verify that token and extract the payload
    const payload = jwt.verify(token as string, config.jwt_secret) as any;

    //* 4. get the user details from the payload
    const user = await prisma.user.findFirst({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
    }

    //* 5. attach the user to the current request objects
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
  }
};

export default authMiddleware;
