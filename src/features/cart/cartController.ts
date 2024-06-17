import { Product } from '@prisma/client';
import prisma from 'config/db.config';
import { NotFoundException } from 'exceptions/notFound';
import { ErrorCodes } from 'exceptions/root';
import { Request, Response } from 'express';
import { ChangeQuantitySchema, CreateCartSchema } from 'schema/cart.schema';
export const addItemToCart = async (req: Request, res: Response) => {
  // TODO : Check for the existence of the same product in user's cart and alter the quantity as required
  const validatedData = CreateCartSchema.parse(req.body);
  let product: Product;
  try {
    product = await prisma.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (err) {
    throw new NotFoundException('Product not found!', ErrorCodes.PRODUCT_NOT_FOUND);
  }
  const cart = await prisma.cartItem.create({
    data: {
      userId: req.user.id,
      productId: product.id,
      quantity: validatedData.quantity,
    },
  });
  res.status(201).json(cart);
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  try {
    // TODO: Check if user is deleting its own cart item only
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: +req.params.id },
    });

    const product = await prisma.product.findFirstOrThrow({
      where: { id: +cartItem.productId },
    });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    // Assuming req.user.id contains the ID of the logged-in user
    // if (cartItem.userId !== req.user.id) {
    //   return res.status(403).json({ success: false, message: 'Unauthorized action' });
    // }

    await prisma.cartItem.delete({
      where: { id: +req.params.id },
    });

    res.status(200).json({ success: true, message: `${product.name} deleted Successfuly` });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
export const changeQuantity = async (req: Request, res: Response) => {
  const validatedData = ChangeQuantitySchema.parse(req.body);
  const updatedCart = await prisma.cartItem.update({
    where: {
      id: +req.params.id,
    },
    data: {
      quantity: validatedData.quantity,
    },
  });
  res.json(updatedCart);
};
export const getCart = async (req: Request, res: Response) => {
  const cart = await prisma.cartItem.findMany({
    where: {
      userId: +req.user.id,
    },
    include: {
      product: true,
    },
  });
  res.json(cart);
};
