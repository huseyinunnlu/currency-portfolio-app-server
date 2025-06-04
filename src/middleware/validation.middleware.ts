import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';

// Helper function to format Zod errors
const formatZodErrors = (error: ZodError) => {
    return error.errors.reduce(
        (acc, err) => {
            const path = err.path.join('.');
            acc[path] = err.message;
            return acc;
        },
        {} as Record<string, string>
    );
};

// Validation middleware factory for request body
export const validateBody = (schema: ZodType) => {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errorCode: 400001,
                    errors: formatZodErrors(error),
                });
                return;
            }
            next(error);
        }
    });
};
