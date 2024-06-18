# Practical Round Task - Ecommerce App Rest Api

## Overview

This is a fully-featured E-Commerce Application built with TypeScript, Express.js, PostgreSQL, and Prisma. The project aims to provide a robust and scalable solution for managing online store operations, including product listings, user management, and order processing.

## Features

- User authentication and authorization
- Product listing and management
- Shopping cart functionality
- Order processing and management

## Tech Stack

- **Backend:**
  - TypeScript
  - Express.js
  - PostgreSQL
  - Prisma
- **Tools and Libraries:**
  - Nodemon
  - Zod
  - Swagger
  - ESLint (for code linting)
  - Prettier (for code formatting)

## Getting Started

### Prerequisites

- Node.js (version v20.14.0)
- PostgreSQL (version 16)

### Database Schema

 ```bash
   Database Schema Files : [Database Schema](https://github.com/theeeep/practical-round-task/blob/main/prisma/schema.prisma)
   ```

### Installation

1. Clone the repository:

   ```bash
   git clone [https://github.com/theeeep/practical-round-task.git](https://github.com/theeeep/practical-round-task.git)
   cd practical-round-task
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Create a PostgreSQL database
   - Update the `.env` file with your database connection details:

     ``` bash
     DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce-backend?schema=public"
     ```

      - Update the `.env` file with your PORT:

     ``` bash
     PORT=YOUR_PORT
     ```

      - Update the `.env` file with your jwt secret:

     ``` bash
     JWT_SECRET=YOUR_SECRET_KEY
     ```

4. Run the Prisma migrations to set up the database schema:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:

   ```bash
   npm run start:dev
   ```

### Scripts

- `npm start:dev`: Starts the development server
- `npm run start:prod`: Builds the project for production
- `npm run build`: Starts the built project
- `npm test`: Runs tests using Jest

### _Task 1 :  Develop an E-Commerce website such as Amazon or Flipkart with database schema_

## API Documentation

### Access the Swagger UI at `http://localhost:3000/api-docs`

## Project Structure

``` bash
├── Readme.md
├── collection.json
├── collection.yml
├── eslint.config.mjs
├── jest.config.ts
├── nodemon.json
├── openapi.json
├── package-lock.json
├── package.json
├── prisma
│   ├── migrations
│   └── schema.prisma
├── src
│   ├── app.ts
│   ├── config
│   │   ├── config.ts
│   │   └── db.config.ts
│   ├── errorHandler.ts
│   ├── exceptions
│   │   ├── badRequests.ts
│   │   ├── internalException.ts
│   │   ├── notFound.ts
│   │   ├── root.ts
│   │   ├── unauthorized.ts
│   │   └── validation.ts
│   ├── features
│   │   ├── auth
│   │   │   ├── authController.ts
│   │   │   └── authRouter.ts
│   │   ├── cart
│   │   │   ├── cartController.ts
│   │   │   └── cartRouter.ts
│   │   ├── orders
│   │   │   ├── orderController.ts
│   │   │   └── orderRouter.ts
│   │   ├── products
│   │   │   ├── productController.ts
│   │   │   └── productRouter.ts
│   │   ├── userAddress
│   │   │   ├── addressController.ts
│   │   │   └── addressRouter.ts
│   │   └── users
│   │       ├── userController.ts
│   │       └── userRouter.ts
│   ├── middlewares
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   └── errors.ts
│   ├── rootRouter.ts
│   ├── schema
│   │   ├── cart.schema.ts
│   │   └── users.schema.ts
│   ├── server.ts
│   └── types
│       └── express.d.ts
├── tsconfig.build.json
└── tsconfig.json

```

### _Task 2: Prepare queries for the below statements:_

- **Find the second highest order value from an "Orders" table :**

     ```bash
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
    ```

- **Monthly Orders analysis for the year 2023 :**
- To enable grouping orders by month, add a computed `month` field that extracts the month from the `createdAt` field. Prisma doesn't directly support computed fields in the schema file, but you can add the month field as an integer and ensure it gets populated by your application logic whenever an order is created.
- Also We have to the modified schema

   ```bash
    model Order {
    id        Int              @id @default(autoincrement())
    userId    Int
    user      User             @relation(fields: [userId], references: [id])
    netAmount Decimal
    address   String
    status    OrderEventStatus @default(PENDING)
    createdAt DateTime         @default(now())
    updatedAt DateTime         @updatedAt
    month     Int              // Add this field to store the extracted month

    products OrderProduct[]
    events   OrderEvent[]

    @@map("orders")
    }
    ```

- Also we have to update createOrder controller  application logic sets the `month` field when creating or updating an `Order

    ```bash
   const createOrder = async (orderData) => {
    const month = new Date(orderData.createdAt).getMonth() + 1; // getMonth() returns month index from 0-11, so add 1

    const order = await prisma.order.create({
        data: {
            ...orderData,
            month: month,
        },
    });

    return order;
    };
    ```

- **Find User wise ordering summary - No. of products, total orders with total value :**

    ```bash
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
  
     ```

- **Find the products which are sold less than 3 times or not sold yet in the last quarter of 2023:**

     ```bash
   const getProductsSoldLessThanThreeTimes = async () => {
  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            orders: {
              every: {
                createdAt: {
                  gte: new Date('2023-10-01'),
                  lt: new Date('2024-01-01'),
                },
              },
            },
          },
          {
            orders: {
              _count: {
                lt: 3,
              },
            },
          },
        ],
      },
    });

    return products;
  } catch (error) {
    console.error('Error fetching products sold less than three times:', error);
    throw new NotFoundException('Order not found!', ErrorCodes.ORDER_NOT_FOUND);
        }
  };
    ```

## Contact

For any inquiries or support, feel free to contact me at <itz.deeepak@gmail.com> or open an issue on GitHub.
