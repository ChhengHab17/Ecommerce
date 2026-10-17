import { AuthenticationError } from '@packages/error-handler';
import { Request, Response, NextFunction } from 'express';
export const isSeller= (req: Request, res: Response, next: NextFunction) => {
    if (req.role !== 'seller') {
        return next(new AuthenticationError('Unauthorized: Only sellers can access this route'));
    }
    next();
}  

export const isUser= (req: Request, res: Response, next: NextFunction) => {
    if (req.role !== 'user') {
        return next(new AuthenticationError('Unauthorized: Only users can access this route'));
    }
    next();
}
