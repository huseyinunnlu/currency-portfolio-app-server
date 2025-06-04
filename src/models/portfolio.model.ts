import { Document, Schema,model } from 'mongoose';
import { randomUUID } from 'crypto';
export interface IPortfolioModel extends Document {
    _id: string;
    portfolioType: "currency" | "gold" | "my-portfolio";
    assetId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    history: IHistory[];
}

export interface IHistory {
    _id: string;
    assetPrice: number;
    amount: number;
    date: Date;
}

const HistorySchema = new Schema<IHistory>({
    _id: {
        type: String,
        required: true,
        default: () => randomUUID()
    },
    assetPrice: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});


const PortfolioSchema = new Schema<IPortfolioModel>({
    _id: {
        type: String,
        required: true,
        default: () => randomUUID()
    },
    portfolioType: {
        type: String,
        enum: ["currency", "gold", "my-portfolio"],
        required: true
    },
    assetId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    history: [HistorySchema]
},{timestamps: true});

export default model<IPortfolioModel>('portfolios', PortfolioSchema);
