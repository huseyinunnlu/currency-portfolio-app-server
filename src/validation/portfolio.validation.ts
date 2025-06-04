import { z } from 'zod';

export const portfolioSchema = z.object({
    portfolioType: z.enum(['currency', 'gold', 'my-portfolio']),
    assetId: z.string().min(1, "You must select an asset"),
    assetPrice: z.number().min(0.01, "Price must be greater than 0"),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    date: z.coerce.date().max(new Date(), "Date must be in the past")
})