import { Router } from 'express';
import currencyController from '@/controllers/currency.controller';
import {authenticate} from "@/middleware/auth.middleware";

const router = Router();

router.get('/currency-history/:legacyCode', currencyController.getCurrencyHistory);
router.post('/get-current-prices-by-keys', authenticate, currencyController.getCurrentPricesByKeys);

export default router;
