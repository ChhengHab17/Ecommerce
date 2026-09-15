import express, { Router } from 'express';

import { forgotPassword, getUser, loginUser, refreshToken, resetPassword, userRegister, verifyForgotPasswordOtp, verifyUser } from '../controller/auth.controller';
import isAuthenticated from '@packages/middleware/isAuthenticated';

const router: Router = express.Router();

router.post('/register', userRegister);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.get('/loggedinUser', isAuthenticated, getUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-forgot-password-otp', verifyForgotPasswordOtp);
router.post('/reset-password', resetPassword);
export default router;