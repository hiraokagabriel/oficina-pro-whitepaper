import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { WorkOrderService } from '../services/WorkOrderService';

export class WorkOrderController {
  private workOrderService: WorkOrderService;

  constructor() {
    this.workOrderService = new WorkOrderService();
  }

  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page = '1', limit = '20', status, clientId } = req.query;
      const result = await this.workOrderService.list({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        status: status as string,
        clientId: clientId as string,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const workOrder = await this.workOrderService.getById(req.params.id);
      res.json(workOrder);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const workOrder = await this.workOrderService.create(req.body, req.user!.id);
      res.status(201).json(workOrder);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const workOrder = await this.workOrderService.update(req.params.id, req.body);
      res.json(workOrder);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const workOrder = await this.workOrderService.updateStatus(req.params.id, status);
      res.json(workOrder);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.workOrderService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
