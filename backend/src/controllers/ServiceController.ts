import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';

export class ServiceController {
  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({ message: 'List services' });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({ message: 'Get service by ID' });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.status(201).json({ message: 'Create service' });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({ message: 'Update service' });
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
