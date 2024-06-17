import prisma from 'config/db.config';
import { NotFoundException } from 'exceptions/notFound';

import { ErrorCodes } from 'exceptions/root';
import { Request, Response } from 'express';
import { number } from 'zod';

//? ---> Create Product
export const createProduct = async (req: Request, res: Response) => {
  // TODO create validator for this request

  const product = await prisma.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(', '),
    },
  });
  res.json(product);
};

//? ---> Update Product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(', ');
    }
    const updateProduct = await prisma.product.update({
      where: {
        id: +req.params.id,
      },
      data: product,
    });
    res.status(200).json({ message: 'Product Updated!', data: product });
  } catch (err) {
    throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND);
  }
};

//? ---> Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const getProductById = await prisma.product.findFirstOrThrow({
      where: {
        id: +productId,
      },
    });
    const deleteProduct = await prisma.product.delete({
      where: {
        id: +productId,
      },
    });
    res.status(200).json({ message: `Product ${getProductById.name} delete Successfully` });
  } catch (err) {
    throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND);
  }
};

//? ---> List Products
export const listProducts = async (req: Request, res: Response) => {
  const count = await prisma.product.count();
  const products = await prisma.product.findMany({
    skip: Number(req.query.skip) || 0,
    take: 5,
  });
  res.json({
    count,
    data: products,
  });
};

//? ---> Get ProductById
export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const getProductById = await prisma.product.findFirstOrThrow({
      where: {
        id: +productId,
      },
    });
    res.status(200).json(getProductById);
  } catch (err) {
    throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND);
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { search: req.query.q.toString() } },
        { description: { search: req.query.q.toString() } },
        { tags: { search: req.query.q.toString() } },
      ],
    },
  });
  if (!products || products.length === 0) {
    res.status(404).json({ message: 'No such product' });
  } else {
    res.json(products);
  }
};
