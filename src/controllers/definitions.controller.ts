import { Request, Response, RequestHandler } from 'express';
import definitionsService from '@/services/definitions.service';
import asyncHandler from 'express-async-handler';

/**
 * Get currency definitions
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const getDefinitionsController: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
    const data = await definitionsService.getDefinitions();

    // Set cache headers for this rarely changing data
    res.setHeader('Cache-Control', 'public, max-age=43200');

    res.json({
        success: true,
        message: 'Success',
        data,
    });
});

export default {
    getDefinitions: getDefinitionsController
};
