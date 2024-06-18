import prisma from 'config/db.config';
import { NotFoundException } from 'exceptions/notFound';
import { ErrorCodes } from 'exceptions/root';
import { Request, Response } from 'express';

export const createOrder = async (req: Request, res: Response) => {
  //? Notes: 1. Create a transaction
  //? Notes: 2. List all the cart items and proceed if cart is not empty
  //? Notes: 3. calculate total amount
  //? Notes: 4. fetch address of user
  //? Notes: 5. to define computed field for formatted address on address module
  //? Notes: 6. create a order and order productsOrder products
  //? Notes: 7. create events
  //? Notes: 8. Empty the cart

  return await prisma.$transaction(async tx => {
    return await prisma.$transaction(async tx => {
      const cartItems = await tx.cartItem.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          product: true,
        },
      });

      if (cartItems.length == 0) {
        return res.json({ message: 'Cart is empty' });
      }
      const price = cartItems.reduce((prev, current) => {
        return prev + current.quantity * +current.product.price;
      }, 0);
      console.log('Ok 2');

      const address = await tx.address.findFirst({
        where: {
          id: req.user.defaultShippingAddress,
        },
      });
      console.log('Ok 3');
      const order = await tx.order.create({
        data: {
          userId: req.user.id,
          netAmount: price,
          address: address.formattedAddress,
          products: {
            create: cartItems.map(cart => {
              return {
                productId: cart.productId,
                quantity: cart.quantity,
              };
            }),
          },
        },
      });
      console.log('Ok 4');

      const orderEvent = await tx.orderEvent.create({
        data: {
          orderId: order.id,
        },
      });
      console.log('Ok 5');

      await tx.cartItem.deleteMany({
        where: {
          userId: req.user.id,
        },
      });
      console.log('Ok 6');

      return res.json(order);
    });
  });
};
export const listOrders = async (req: Request, res: Response) => {
  const ordersList = await prisma.order.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json(ordersList);
};
export const cancelOrder = async (req: Request, res: Response) => {
  // 1. wrap it inside tranaction
  // 2. check if the users is cancelling its own order

  try {
    const order = await prisma.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: 'CANCELLED',
      },
    });
    await prisma.orderEvent.create({
      data: {
        orderId: order.id,
        status: 'CANCELLED',
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException('Order not found', ErrorCodes.ORDER_NOT_FOUND);
  }
};
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderItem = await prisma.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        products: true,
        events: true,
      },
    });
    if (!orderItem) {
      return res.json({ message: 'There is no Order with this Id' });
    }
    res.json(orderItem);
  } catch (err) {
    throw new NotFoundException('Order not found!', ErrorCodes.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  try {
    let whereClause = {};
    const status = req.query.status;
    if (status) {
      whereClause = {
        status,
      };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      skip: +req.query.skip || 0,
      take: 5,
    });
    if (orders.length == 0) {
      return res.json({ message: ' Empty Order List' });
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new NotFoundException('Orders not found!', ErrorCodes.ORDER_NOT_FOUND);
  }
};
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const orderStatus = await prisma.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: req.body.status,
      },
    });

    await prisma.orderEvent.create({
      data: {
        orderId: orderStatus.id,
        status: req.body.status,
      },
    });
    res.json(orderStatus);
  } catch (err) {
    throw new NotFoundException('Order not found!', ErrorCodes.ORDER_NOT_FOUND);
  }
};

export const userOrderSummary = async (req: Request, res: Response) => {
  try {
    let whereClause: any = {
      userId: +req.params.id,
    };

    const status = req.params.status;
    if (status) {
      whereClause = {
        ...whereClause,
        status,
      };
    }

    const userOrders = await prisma.order.findMany({
      where: whereClause,
      skip: +req.query.skip || 0,
      take: 5,
    });

    if (userOrders.length == 0) {
      return res.json({ message: 'Empty Order List' });
    }

    res.json(userOrders);
  } catch (error) {
    throw new NotFoundException('Order not found!', ErrorCodes.ORDER_NOT_FOUND);
  }
};

export const findSecondHighestOrderValue = async () => {
  const secondHighestOrder = await prisma.order.findMany({
    select: {
      netAmount: true,
    },
    orderBy: {
      netAmount: 'desc',
    },
    skip: 1,
    take: 1,
  });

  return secondHighestOrder;
};
