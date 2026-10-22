import express, { Router } from 'express';
import {
  CreateDiscountCode,
  deleteDiscountCode,
  deleteProductImage,
  getCategories,
  getDiscountCodes,
  uploadProductImage,
} from '../controllers/product.controller';
import isAuthenticated from '@packages/middleware/isAuthenticated';
import { isSeller } from '@packages/middleware/authorizeRole';

const router: Router = Router();

router.get('/getCategories', getCategories);
router.get('/discount-codes', isAuthenticated, isSeller, getDiscountCodes);
router.post('/discount-codes', isAuthenticated, isSeller, CreateDiscountCode);
router.delete('/discount-codes/:id',isAuthenticated, isSeller, deleteDiscountCode);
router.post('/upload-product-image', isAuthenticated, isSeller, uploadProductImage);
router.delete('/delete-product-image', isAuthenticated, isSeller, deleteProductImage);

export default router;
