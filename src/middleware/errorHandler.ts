import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '../types';
import { AppError } from '@/lib/errors';
import { ERRORS } from '@/constants/errorCodes';
import axios from 'axios';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.log(err);
    let statusCode = 500;
    let errorMessage = 'Internal Server Error';
    let errorCode = ERRORS.INTERNAL_SERVER_ERROR.code;

    // First priority: Handle our custom AppError instances
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        errorMessage = err.message;
        errorCode = err.code;
    }
    // Handle Axios errors
    else if (axios.isAxiosError(err)) {
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            statusCode = err.response.status || 500;
            errorMessage = `External API error: ${err.message}`;
            errorCode = ERRORS.EXTERNAL_API_ERROR.code;
        } else if (err.request) {
            // The request was made but no response was received
            statusCode = 503;
            errorMessage = 'Service unavailable';
            errorCode = ERRORS.EXTERNAL_API_ERROR.code;
        } else {
            // Something happened in setting up the request that triggered an Error
            statusCode = 500;
            errorMessage = `API request setup error: ${err.message}`;
            errorCode = ERRORS.EXTERNAL_API_ERROR.code;
        }
    }
    // For any other errors, use a generic error message in production and the actual message in development
    else {
        errorMessage = process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error';
    }

    // Return standardized error response
    const errorResponse: ApiErrorResponse = {
        success: false,
        message: errorMessage,
        errorCode: errorCode,
    };

    res.status(statusCode).json(errorResponse);
};

/**
 * Handle 404 errors for routes that don't exist
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Route not found: ${req.originalUrl}`, 404, ERRORS.RESOURCE_NOT_FOUND.code));
};
