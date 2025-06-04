import express from 'express';
import authController from '@/controllers/auth.controller';
import { validateBody } from '@/middleware/validation.middleware';
import { authenticate } from '@/middleware/auth.middleware';
import { registerSchema, loginSchema, changePasswordSchema, updateProfileSchema } from '@/validation/auth.validation';

const router = express.Router();

// Public routes
router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);

// Protected routes (require authentication)
router.get('/profile', authenticate, authController.getProfile);
router.put('/update-profile', authenticate, validateBody(updateProfileSchema), authController.updateProfile);
router.post('/change-password', authenticate, validateBody(changePasswordSchema), authController.changePassword);

export default router;
