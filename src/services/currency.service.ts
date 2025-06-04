import axios from 'axios';
import {cacheManager} from '@/lib/cacheManager';
import {InternalServerError} from '@/lib/errors';
import {ERRORS} from '@/constants';

async function getCurrencyHistory(
    legacyCode: string,
    startDate: string,
    endDate: string,
    period: string
): Promise<any> {
    const token = cacheManager.get('token');
    const headers = {
        origin: process.env.SERVICE_URL,
        authorization: `Bearer ${token}`,
    };

    const url = `${process.env.HISTORY_SERVICE_URL}/cloud-proxy/historical-service/intraday/code/${encodeURIComponent(legacyCode)}/period/${period}/from/${startDate}/to/${endDate}`;

    const result = await axios.get(url, {headers});

    if (result?.status === 200) {
        return result.data;
    }

    throw new InternalServerError(ERRORS.EXTERNAL_API_ERROR);
}

async function getCurrentPricesByKeys(keys: string[]): Promise<any> {
    const currencyData = cacheManager.get('currencyData');

    if (!currencyData || !Array.isArray(currencyData)) {
        throw new InternalServerError(ERRORS.CURRENCY_DATA_NOT_FOUND);
    }

    return currencyData.filter((currency) => keys.includes(currency._i));
}

export default {
    getCurrencyHistory,
    getCurrentPricesByKeys
}; 