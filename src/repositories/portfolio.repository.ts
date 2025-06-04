import { BaseRepository } from './base.repository';
import PortfolioModel, { IPortfolioModel } from '../models/portfolio.model';

export class PortfolioRepository extends BaseRepository<IPortfolioModel> {
  constructor() {
    super(PortfolioModel);
  }
}

// Create a singleton instance
export const portfolioRepository = new PortfolioRepository(); 