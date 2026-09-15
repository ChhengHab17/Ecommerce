import { Request, Response, NextFunction } from 'express';
import {
  checkOtpRestritions,
  handleForgotPassword,
  handleVerifyForgotPasswordOtp,
  sendOtp,
  trackOtpRequest,
  validateResgistrationData,
  verifyOtp,
} from '../utils/auth.helper';
import bcrypt from 'bcryptjs';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import prisma from '@packages/lib/prisma';
import { AuthenticationError, ValidationError } from '@packages/error-handler';
import { setCookie } from '../utils/cookies/setCookie';

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    validateResgistrationData(req.body, 'user');
    const { email, name } = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(new ValidationError('Email already exists'));
    }

    await checkOtpRestritions(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(name, email, 'user-activation-email');

    res.status(200).json({
      message: 'OTP sent to your email. Please check your inbox.',
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, password, name} = req.body;

    if (!email || !otp || !password || !name) {
      return next(new ValidationError('Missing required fields'));
    }

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(new ValidationError('Email already exists'));
    }
    await verifyOtp(email, otp, next);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return res.status(201).json({
      message: 'User registered successfully',
      success: true,
    })

  }catch (error) {
    return next(error);
  }
}
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError('Missing required fields'));
    }
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      return next(new ValidationError('Invalid email or password'));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      return next(new ValidationError('Invalid email or password'));
    }

    const accessToken = jwt.sign({ userId: user.id, role: "user" }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId: user.id, role: "user" }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: '7d',
    });
    setCookie(res, 'access_token', accessToken);
    setCookie(res, 'refresh_token', refreshToken);
    console.log('Access Token:', accessToken);

    return res.status(200).json({
      message: 'User logged in successfully',
      success: true,
      data: { user: { id: user.id, email: user.email, name: user.name } },
    });

  }catch (error){
    return next(error);
  }
}
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AuthenticationError('User not authenticated'));
    }
    return res.status(200).json({
      message: 'User found',
      success: true,
      data: { user: { id: user.id, email: user.email, name: user.name } },
    });
  } catch (error) {
    return next(error);
  }
}
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if(!refreshToken) {
      throw new ValidationError('Refresh token not found');
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET! as string) as { userId: string, role: string };

    if (!decoded || !decoded.userId || decoded.role !== 'user') {
      throw new JsonWebTokenError('Invalid refresh token');
    }
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    const newAccessToken = jwt.sign({ userId: user.id, role: "user" }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: '15m',
    });
    setCookie(res, 'access_token', newAccessToken);
    return res.status(201).json({
      success: true,
    });


  }catch (error) {
    return next(error);
  }
}
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  await handleForgotPassword(req, res, next, "user");
}

export const verifyForgotPasswordOtp = async (req: Request, res: Response, next: NextFunction) => {
  await handleVerifyForgotPasswordOtp(req, res, next);
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {email, newPassword} = req.body;
    if (!email || !newPassword) {
      return next(new ValidationError('Missing required fields'));
    }
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      return next(new ValidationError('User not found'));
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password!);
    if (isSamePassword) {
      return next(new ValidationError('New password cannot be the same as the old password'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      message: 'Password reset successfully',
      success: true,
    });
  }
  catch (error){
    return next(error);
  }
}