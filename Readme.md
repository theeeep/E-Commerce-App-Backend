# Practical Round Task - Ecommerce App Rest Api

## Overview

This is a fully-featured Role based( User, Admin ) E-Commerce Application built with TypeScript, Express.js, PostgreSQL, and Prisma. This project is designed for scalability and robustness, simplifying online store operations with efficient product listings, user management, and order processing.The codebase is feature-based Architecure (Design Pattern), organized for modularity and maintainability.

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

> [!TIP]
> Database Schema Files : [Database Schema](https://github.com/theeeep/practical-round-task/blob/main/prisma/schema.prisma)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/theeeep/practical-round-task.git
   cd practical-round-task
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the Database and Environment file:

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

## API Documentation

> [!NOTE]
> Access the Swagger UI for API Documentation at `http://localhost:3000/api-docs`

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

## Contact

For any inquiries or support, feel free to contact me at <itz.deeepak@gmail.com> or open an issue on GitHub.
