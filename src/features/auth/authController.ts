import prisma from 'config/db.config';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcrypt';
import { config } from 'config/config';
import { BadRequestsException } from 'exceptions/badRequests';
import { ErrorCodes } from 'exceptions/root';
import { error } from 'console';
import { SignUpSchema } from 'schema/users.schema';
import { NotFoundException } from 'exceptions/notFound';

//* -----> Signup
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  SignUpSchema.parse(req.body);
  const { name, email, password } = req.body;

  let user = await prisma.user.findFirst({ where: { email } });

  if (user) {
    new BadRequestsException('User Already Exists!', ErrorCodes.USER_ALREADY_EXISTS, error);
  }

  user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });

  res.status(201).json({ message: ` User ${user.name} created`, data: user });
};

const tokenStore = new Set(); // In-memory store for tokens (for demonstration purposes)

//* -----> Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    throw new NotFoundException('User not found!', ErrorCodes.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestsException('Incorrect Password!', ErrorCodes.INCORRECT_PASSWORD, error);
  }

  const token = jwt.sign({ userId: user.id }, config.jwt_secret);
  tokenStore.add(token); // Store the token

  res.status(201).json({ user: user.name, accessToken: token });
};

//* -----> Logout
export const logout = async (req: Request, res: Response) => {
  const token = req.header('Authorization');
  console.log(token);

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  if (tokenStore.has(token)) {
    tokenStore.delete(token); // Invalidate the token
    return res.status(200).json({ message: 'Logged out successfully' });
  } else {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

//* /me -> return the logged in user
export const me = async (req: Request, res: Response) => {
  res.json((req as any)?.user);
};
