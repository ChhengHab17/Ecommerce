import { users as User } from '@prisma/client'; // adjust to your Prisma model name

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
  }
}

export {};