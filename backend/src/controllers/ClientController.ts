import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { ClientService } from '../services/ClientService';

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page = '1', limit = '20', search } = req.query;
      const result = await this.clientService.list({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        search: search as string,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const client = await this.clientService.getById(req.params.id);
      res.json(client);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const client = await this.clientService.create(req.body);
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const client = await this.clientService.update(req.params.id, req.body);
      res.json(client);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.clientService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
