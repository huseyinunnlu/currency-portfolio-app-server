import { Router } from 'express';
import {authenticate} from "@/middleware/auth.middleware";
import portfolioController from '@/controllers/portfolio.controller';
import { validateBody } from '@/middleware/validation.middleware';
import { portfolioSchema } from '@/validation/portfolio.validation';

const router = Router();

router.post('/portfolio-create', authenticate, validateBody(portfolioSchema), portfolioController.createPortfolio);
router.get('/portfolio-list', authenticate, portfolioController.getPortfolioList);
router.get('/portfolio-dashboard-data', authenticate, portfolioController.getPortfolioDashboardData);
router.get('/portfolio-details/:id', authenticate, portfolioController.getPortfolioDetailsById);
router.delete('/portfolio-delete/:id', authenticate, portfolioController.deletePortfolioById);
router.delete('/portfolio/:id/item-delete/:itemId', authenticate, portfolioController.deletePortfolioItemById);

export default router;
