import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';

export class LedgerController {
  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({ message: 'List ledger entries' });
    } catch (error) {
      next(error);
    }
  };

  getSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({ message: 'Get ledger summary' });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({ message: 'Get ledger entry by ID' });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.status(201).json({ message: 'Create ledger entry' });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({ message: 'Update ledger entry' });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
