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
      req.cookies["access_token"] || req.cookies["seller_access_token"] || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // verify the token here
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET! as string,
    ) as { id: string; role: 'user' | 'seller' | 'admin' };
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let account;
    if (decoded.role === 'user') {
        account = await prisma.users.findUnique({ where: { id: decoded.id  } });
        req.user = account;
    }else if (decoded.role === 'seller') {
        account = await prisma.sellers.findUnique({ where: { id: decoded.id }, include: { shop: true } });
        req.seller = account;
    }

    if (!account) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.role = decoded.role;
    return next();
  } catch (error) {
    return next(error);
  }
};

export default isAuthenticated;