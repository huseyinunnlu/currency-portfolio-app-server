import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export class BaseRepository<T extends Document> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        const newDocument = new this.model(data);
        return (await newDocument.save()) as T;
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(filter).exec();
    }

    async find(filter: FilterQuery<T> = {}, _sort: any = {}, _limit: number = 0, _skip: number = 0): Promise<T[]> {
        return this.model.find(filter).exec();
    }

    async findWithPagination(filter: FilterQuery<T> = {}, _sort: any = {}, _limit: number = 0, _skip: number = 0): Promise<T[]> {
        return this.model.find(filter).sort(_sort).limit(_limit).skip(_skip).exec();
    }

    async update(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async updateOne(filter: FilterQuery<T>, updateData: UpdateQuery<T>): Promise<T | null> {
        return this.model.findOneAndUpdate(filter, updateData, { new: true }).exec();
    }

    async delete(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }

    async deleteOne(filter: FilterQuery<T>): Promise<T | null> {
        return this.model.findOneAndDelete(filter).exec();
    }

    async exists(filter: FilterQuery<T>): Promise<boolean> {
        const result = await this.model.exists(filter);
        return !!result;
    }

    async count(filter: FilterQuery<T> = {}): Promise<number> {
        return this.model.countDocuments(filter).exec();
    }
}
