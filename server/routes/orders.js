import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);

export default router;
