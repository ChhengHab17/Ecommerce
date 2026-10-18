
import express, { Router } from 'express';
import { getCategories } from '../controllers/product.controller';

const router: Router = Router();

router.get('/getCategories', getCategories);

export default router;