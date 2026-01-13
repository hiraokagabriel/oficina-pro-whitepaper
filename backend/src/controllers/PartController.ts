import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';

export class PartController {
  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({ message: 'List parts' });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({ message: 'Get part by ID' });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.status(201).json({ message: 'Create part' });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({ message: 'Update part' });
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
