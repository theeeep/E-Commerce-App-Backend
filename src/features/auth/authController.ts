import prisma from 'config/db.config';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcrypt';
import { config } from 'config/config';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  let user = await prisma.user.findFirst({ where: { email } });

  if (user) {
    throw Error('User already exists');
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
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prisma.user.findFirst({ where: { email } });
  console.log(user);

  if (!user) {
    throw Error('User not found!');
  }
  if (!compareSync(password, user.password)) {
    throw Error('Incorrect Password!');
  }

  const accessToken = jwt.sign({ userId: user.id }, config.jwt_secret);

  res.status(201).json({ user: user.name, accessToken: accessToken });
};
