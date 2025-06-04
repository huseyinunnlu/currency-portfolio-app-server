import axios from 'axios';
import { InternalServerError } from '@/lib/errors';
import { ERRORS } from '@/constants';

/**
 * Fetch currency definitions from the external service
 * @returns {Promise<any>} Definitions data from the service
 * @throws {Error} If the service URL is not configured or if there's an error fetching the data
 */
async function getDefinitions(): Promise<any> {
    const result = await axios.get(`${process.env.SERVICE_URL}/definitions`);

    if (result?.status === 200) {
        return result.data;
    }

    throw new InternalServerError(ERRORS.EXTERNAL_API_ERROR);
}

export default {
    getDefinitions
};
