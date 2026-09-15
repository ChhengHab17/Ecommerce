import crypto from 'crypto';
import { ValidationError } from '@packages/error-handler';
import redis from '@packages/lib/redis';
import { sendEmail } from './sendMails';
import {Request, Response, NextFunction } from 'express';
import prisma from '@packages/lib/prisma';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateResgistrationData = (
  data: any,
  userType: 'user' | 'admin',
) => {
  const { email, name } = data;

  if (!email || !name) {
    throw new Error('Missing required fields');
  }
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
};

export const checkOtpRestritions = async (
  email: string,
  next: NextFunction,
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        'Acount is locked due to multiple failed OTP attempts. Please try again later.',
      ),
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError('Too many OTP requests. Please try again later.'),
    );
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError(
        'Please wait a minute before requesting another OTP.',
      ),
    );
  }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, 'true', 'EX', 3600); // Lock for 1 hour
    return next(
      new ValidationError('Too many OTP requests. Please try again later.'),
    );
  }
  await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600); // Track Request
};
export const sendOtp = async (
  name: string,
  email: string,
  template: string,
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, template, { name, otp }, 'Verify Your Email');
  await redis.set(`otp:${email}`, otp, 'EX', 300); // Store OTP in Redis with a 5-minute expiration
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60);
};

export const verifyOtp = async (email: string, otp: string, next: NextFunction) => {
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    throw new ValidationError('OTP has expired. Please request a new one.');
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || '0');

  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, 'true', 'EX', 1800);
      await redis.del(`otp:${email}`);
      throw new ValidationError('Too many failed attempts. Your account is locked for 30 minutes.');
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, 'EX', 1800);
      throw new ValidationError('Invalid OTP. You have ${2- failedAttempts} attempts left.');
  }
  await redis.del(`otp:${email}`, failedAttemptsKey);
}


export const handleForgotPassword = async (req: Request, res: Response, next: NextFunction, userType: "user" | "admin") => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ValidationError('Missing required fields');
    }

    const user = userType === 'user' && await prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new ValidationError('User not found');
    }

    await checkOtpRestritions(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(user.name, email, 'forgot-password-user-mail');

    res.status(200).json({
      message: 'OTP sent to your email. Please check your inbox.',
    });
  }catch (error) {
    return next(error);
  }
}
export const handleVerifyForgotPasswordOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp} = req.body;
    if (!email || !otp) {
      throw new ValidationError('Missing required fields');
    }
    await verifyOtp(email, otp, next);

    res.status(200).json({
      message: 'OTP verified successfully. You can now reset your password.',
    });
  }catch (error){
    return next(error);
  }

}