import { Router } from 'express';
import { WorkOrderController } from '../controllers/WorkOrderController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createWorkOrderSchema, updateWorkOrderSchema } from '../schemas/workOrder.schema';

const router = Router();
const workOrderController = new WorkOrderController();

// All routes require authentication
router.use(authenticate);

router.get('/', workOrderController.list);
router.get('/:id', workOrderController.getById);
router.post('/', validate(createWorkOrderSchema), workOrderController.create);
router.put('/:id', validate(updateWorkOrderSchema), workOrderController.update);
router.patch('/:id/status', workOrderController.updateStatus);
router.delete('/:id', authorize('ADMIN', 'MANAGER'), workOrderController.delete);

export default router;
