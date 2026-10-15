import express, { Router } from 'express';

import {
  createShop,
  forgotPassword,
  getSeller,
  getUser,
  loginSeller,
  loginUser,
  refreshToken,
  registerSeller,
  resetPassword,
  userRegister,
  verifyForgotPasswordOtp,
  verifySeller,
  verifyUser,
} from '../controller/auth.controller';
import isAuthenticated from '@packages/middleware/isAuthenticated';
import { isSeller } from '@packages/middleware/authorizeRole';

const router: Router = express.Router();

router.post('/register', userRegister);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.get('/loggedinUser', isAuthenticated, getUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-forgot-password-user', verifyForgotPasswordOtp);
router.post('/reset-password-user', resetPassword);
router.post('/seller-register', registerSeller);
router.post('/seller-verify', verifySeller);
router.post('/create-shop', createShop);
router.post('/login-seller', loginSeller);
router.get('/logged-in-seller', isAuthenticated, isSeller, getSeller);

export default router;
