import { Request, Response } from 'express';
import currencyService from '@/services/currency.service';
import asyncHandler from 'express-async-handler';
import {ERRORS} from "@/constants";
import {BadRequestError} from "@/lib/errors";

const getCurrencyHistoryController = asyncHandler(async (req: Request, res: Response) => {
    const { legacyCode } = req.params;
    const { startDate, endDate, period } = req.query;

    const data = await currencyService.getCurrencyHistory(legacyCode, startDate as string, endDate as string, period as string);

    res.json({
        success: true,
        message: 'Success',
        data,
    });
});

const getCurrentPricesByKeysController = asyncHandler(async (req: Request, res: Response) => {
    const {keys} = req.body

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
        throw new BadRequestError(ERRORS.INVALID_TYPE_ERROR);
    }

    const data = await currencyService.getCurrentPricesByKeys(keys);

    res.json({
        success: true,
        message: 'Success',
        data,
    })
})

export default {
    getCurrencyHistory: getCurrencyHistoryController,
    getCurrentPricesByKeys: getCurrentPricesByKeysController
}; 