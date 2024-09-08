import { Router } from 'express';
import { addProducts, viewQuotations } from '../controllers/invoice.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/products', authMiddleware, addProducts);
router.get('/quotations',authMiddleware, viewQuotations);

export default router;
