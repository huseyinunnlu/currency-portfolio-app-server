import  asyncHandler from 'express-async-handler';
import portfolioService from '@/services/portfolio.service';
import { portfolioSchema } from '@/validation/portfolio.validation';
import { Request, Response } from 'express';
import z from 'zod';

const createPortfolioController = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as z.infer<typeof portfolioSchema>;

    const portfolioId = await portfolioService.createPortfolio(body, req.user.id);
        
    res.json({
        success: true,
        message: 'Portfolio created successfully',
        data: portfolioId,
    });
});

const getPortfolioListController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const {type = "all", limit = "10", offset = "0"} = req.query as {
        type: "all" | "currency" | "gold" | "my-portfolio";
        limit: string;
        offset: string;
    };


    const portfolioList = await portfolioService.getPortfolioList(userId, type, limit, offset);

    res.json({
        success: true,
        message: 'Portfolio list retrieved successfully',
        data: portfolioList,
    });
});

const getPortfolioDashboardDataController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const {type = "all"} = req.query as {
        type: "all" | "currency" | "gold" | "my-portfolio";
    };

    const portfolioDashboardData = await portfolioService.getPortfolioDashboardData(userId, type);

    res.json({
        success: true,
        message: 'Portfolio dashboard data retrieved successfully',
        data: portfolioDashboardData,
    });
});

const getPortfolioDetailsByIdController = asyncHandler(async (req: Request, res: Response) => {
    const userId:string = req.user.id;
    const portfolioId:string = req.params.id;

    const portfolioDetails = await portfolioService.getPortfolioDetailsById(userId, portfolioId);

    res.json({
        success: true,
        message: 'Portfolio details retrieved successfully',
        data: portfolioDetails,
    });
});

const deletePortfolioByIdController = asyncHandler(async (req: Request, res: Response) => {
    const userId:string = req.user.id;
    const portfolioId:string = req.params.id;

    await portfolioService.deletePortfolioById(userId, portfolioId);

    res.json({
        success: true,
        message: 'Portfolio deleted successfully',
        data: null,
    });
});

const deletePortfolioItemByIdController = asyncHandler(async (req: Request, res: Response) => {
    const userId:string = req.user.id;
    const portfolioId:string = req.params.id;
    const itemId:string = req.params.itemId;

    await portfolioService.deletePortfolioItemById(userId, portfolioId, itemId);

    res.json({
        success: true,
        message: 'Portfolio item deleted successfully',
        data: null,
    });
});

export default {
    createPortfolio: createPortfolioController,
    getPortfolioList: getPortfolioListController,
    getPortfolioDashboardData: getPortfolioDashboardDataController,
    getPortfolioDetailsById: getPortfolioDetailsByIdController,
    deletePortfolioById: deletePortfolioByIdController,
    deletePortfolioItemById: deletePortfolioItemByIdController
};
