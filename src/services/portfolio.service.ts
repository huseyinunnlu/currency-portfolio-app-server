import { z } from 'zod';
import { portfolioSchema } from '@/validation/portfolio.validation';
import { portfolioRepository } from '@/repositories';
import { BadRequestError, NotFoundError } from '@/lib/errors';
import { ERRORS, SYMBOLS } from '@/constants';
import { cacheManager } from '@/lib/cacheManager';
import mongoose from 'mongoose';

async function createPortfolio(body: z.infer<typeof portfolioSchema>, userId: string): Promise<any> {
    if (!SYMBOLS.includes(body.assetId)) {
        throw new BadRequestError(ERRORS.INVALID_ASSET_ID);
    }

    const isPortfolioExists = await portfolioRepository.findOne({userId, assetId: body.assetId});

    let portfolio;
    if (isPortfolioExists) {
        const newHistory = {
            assetPrice: body.assetPrice,
            amount: body.amount,
            date: new Date()
        }
        portfolio = await portfolioRepository.updateOne({_id: isPortfolioExists._id}, {$push: {history: newHistory}});
    } else {
        const newPortfolio = {
            portfolioType: body.portfolioType,
            assetId: body.assetId,
            userId: userId,
            history: [
                {
                    _id: new mongoose.Types.UUID().toString(),
                    assetPrice: body.assetPrice,
                    amount: body.amount,
                    date: new Date()
                }
            ]
        }
        portfolio = await portfolioRepository.create(newPortfolio);
    }

    if (!portfolio) {
        throw new BadRequestError(ERRORS.PORTFOLIO_CREATION_FAILED);
    }

    return portfolio._id;
}

async function getPortfolioList(userId: string, type: string = "all", limit: string = "10", offset: string = "0"): Promise<any> {
    const filter = {
        userId,
        ...(type !== "all" && {portfolioType: type})
    };

    const portfolioList = await portfolioRepository.findWithPagination(filter, {}, parseInt(limit), parseInt(offset));
    const currencyData = cacheManager.get('currencyData') as any[];
    
    const formattedPortfolioList = portfolioList.map((portfolio) => {
        const selectedCurrency = currencyData.find((currency) => currency._i === portfolio.assetId);
        const {amount, assetPrice, currentPrice} = portfolio.history.reduce((acc, curr) => {
            acc.amount += curr.amount;
            acc.assetPrice += curr.assetPrice;
            acc.currentPrice += selectedCurrency.l * curr.amount;
            return acc;
        }, {amount: 0, assetPrice: 0, currentPrice: 0, change: 0});
        return {
            _id: portfolio._id,
            userId: portfolio.userId,
            portfolioType: portfolio.portfolioType,
            assetId: portfolio.assetId,
            createdAt: portfolio.createdAt,
            updatedAt: portfolio.updatedAt,
            amount: amount,
            assetPrice: assetPrice,
            currentPrice: currentPrice,
            change: currentPrice - assetPrice,
            changePercentage: ((currentPrice - assetPrice) / assetPrice) * 100,
        }
    });
    
    return {
        total: portfolioList.length,
        data: formattedPortfolioList,
        offset: offset,
        limit: limit
    };
}

async function getPortfolioDashboardData(userId: string, type: string = "all"): Promise<any> {
    const portfolioData = await portfolioRepository.find({userId, ...(type !== "all" && {portfolioType: type})});
    const currencyData = cacheManager.get('currencyData') as any[];

    let totalPortfolioBuyPrice = 0;
    let totalPortfolioCurrentPrice = 0;
    let chartData: any[] = [];
    
    portfolioData.forEach((portfolio) => {
        const selectedCurrency = currencyData.find((currency) => currency._i === portfolio.assetId);
        totalPortfolioBuyPrice += portfolio.history.reduce((acc, curr) => acc + curr.amount * curr.assetPrice, 0);
        totalPortfolioCurrentPrice += portfolio.history.reduce((acc, curr) => acc + curr.amount * selectedCurrency.l, 0);
        
        chartData.push({
            assetId: portfolio.assetId,
            amount: portfolio.history.reduce((acc, curr) => acc + curr.amount, 0),
            buyPrice: portfolio.history.reduce((acc, curr) => acc + curr.amount * curr.assetPrice, 0),
            currentPrice: portfolio.history.reduce((acc, curr) => acc + curr.amount * selectedCurrency.l, 0),
        });
    });

    let totalPortfolioPriceChange = totalPortfolioCurrentPrice - totalPortfolioBuyPrice;
    let totalPortfolioPriceChangePercentage = ((totalPortfolioPriceChange / totalPortfolioBuyPrice) * 100) || 0;

    return {
        totalPortfolioBuyPrice,
        totalPortfolioCurrentPrice,
        totalPortfolioPriceChange,
        totalPortfolioPriceChangePercentage,
        chartData
    };
}

async function getPortfolioDetailsById(userId: string, portfolioId: string): Promise<any> {
    const portfolio = await portfolioRepository.findOne({_id: portfolioId, userId});
    const currencyData = cacheManager.get('currencyData') as any[]; 
    const selectedCurrency = currencyData.find((currency) => currency._i === portfolio?.assetId);

    if (!portfolio || !selectedCurrency) {
        throw new NotFoundError(ERRORS.PORTFOLIO_NOT_FOUND);
    }

    const {
        amount,
        assetPrice,
    } = portfolio.history.reduce((acc, curr) => {
        acc.amount += curr.amount;
        acc.assetPrice += curr.amount * curr.assetPrice;
        return acc;
    }, {amount: 0, assetPrice: 0 });
    
    
    const formattedPortfolio = {
        portfolio: {
            _id: portfolio._id,
            userId: portfolio.userId,
            portfolioType: portfolio.portfolioType,
            assetId: portfolio.assetId,
            createdAt: portfolio.createdAt,
            updatedAt: portfolio.updatedAt,
        },
        history: portfolio.history,
        livePriceData: selectedCurrency,
        amount,
        assetPrice,
        currentPrice: amount * selectedCurrency.l,
        change: (amount * selectedCurrency.l) - assetPrice,
        changePercentage: (((amount * selectedCurrency.l) - assetPrice) / assetPrice) * 100
    }

    return formattedPortfolio;
}

async function deletePortfolioById(userId: string, portfolioId: string): Promise<any> {
    const portfolio = await portfolioRepository.findOne({_id: portfolioId, userId});
    if (!portfolio) {
        throw new NotFoundError(ERRORS.PORTFOLIO_NOT_FOUND);
    }
    return portfolioRepository.deleteOne({_id: portfolioId});
}

async function deletePortfolioItemById(userId: string, portfolioId: string, itemId: string): Promise<any> {
    const portfolio = await portfolioRepository.findOne({_id: portfolioId, userId});
    if (!portfolio) {
        throw new NotFoundError(ERRORS.PORTFOLIO_NOT_FOUND);
    }
    const updatedPortfolio = await portfolioRepository.updateOne({_id: portfolioId}, {$pull: {history: {_id: itemId}}});
    if (!updatedPortfolio) {
        throw new BadRequestError(ERRORS.PORTFOLIO_ITEM_DELETION_FAILED);
    }
    if (updatedPortfolio.history.length === 0) {
        await portfolioRepository.deleteOne({_id: portfolioId});
    }
    return updatedPortfolio;
}

export default {
    createPortfolio,
    getPortfolioList,
    getPortfolioDashboardData,
    getPortfolioDetailsById,
    deletePortfolioById,
    deletePortfolioItemById
};
