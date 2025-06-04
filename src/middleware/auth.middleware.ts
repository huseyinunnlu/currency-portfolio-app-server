import { Request, Response, NextFunction } from 'express';
import authService from '@/services/auth.service';
import { UnauthorizedError } from '@/lib/errors';
import { ERRORS } from '@/constants';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                email: string;
            };
        }
    }
}

// Authentication middleware
export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
    debugger
    try {
        // Get token from headers
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError(ERRORS.UNAUTHORIZED);
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token and get payload
        // verifyToken will throw UnauthorizedError if token is invalid
        const payload = authService.verifyToken(token);

        // Since verifyToken throws on failure, payload will always be defined here
        if (!payload) {
            throw new UnauthorizedError(ERRORS.INVALID_TOKEN);
        }

        // Add user to request
        req.user = {
            id: payload.id,
            email: payload.email,
        };

        next();
    } catch (error) {
        next(error);
    }
};
