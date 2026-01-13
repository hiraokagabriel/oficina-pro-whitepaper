import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../utils/AppError';

export class VehicleController {
  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // TODO: Implement
      res.json({ message: 'List vehicles' });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // TODO: Implement
      res.json({ message: 'Get vehicle by ID' });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // TODO: Implement
      res.status(201).json({ message: 'Create vehicle' });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // TODO: Implement
      res.json({ message: 'Update vehicle' });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // TODO: Implement
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
