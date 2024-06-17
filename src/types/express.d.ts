import { User as PrismaUser } from '../prisma/prismaclient';
import * as express from 'express';

// declare global {
//   namespace Express {
//     export interface Request {
//       user?: PrismaUser;
//     }
//   }
// }

declare module 'passport' {
  namespace Express {
    interface User extends PrismaUser {}
  }
}
declare module 'express-serve-static-core' {
  interface Request {
    user?: PrismaUser;
  }
  interface Response {
    user?: PrismaUser;
  }
}

declare module 'express-session' {
  interface SessionData {
    user: PrismaUser;
  }
}
