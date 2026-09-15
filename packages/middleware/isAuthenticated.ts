import prisma from '@packages/lib/prisma';
import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies.access_token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // verify the token here
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET! as string,
    ) as { userId: string; role: 'user' | 'admin' };
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const account = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });
    if (!account) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = account;
    return next();
  } catch (error) {
    return next(error);
  }
};

export default isAuthenticated;