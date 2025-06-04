import express from 'express';
import authRoutes from './auth.routes';
import currencyRoutes from './currency.routes';
import definitionsRoutes from './definitions.routes';
import portfolioRoutes from './portfolio.routes';

// Create router instance
const router = express.Router();

// Health check route
router.get('/health', (_req, res) => {
    res.send('OK');
});

router.use('/auth', authRoutes);
router.use(currencyRoutes);
router.use(definitionsRoutes);
router.use(portfolioRoutes);

export default router;
