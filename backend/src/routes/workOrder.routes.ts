import { Router } from 'express';
import { WorkOrderController } from '../controllers/workOrder.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
const controller = new WorkOrderController();

router.use(authenticate);

router.get('/statistics', controller.getStatistics);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authorize('ADMIN', 'MANAGER', 'MECHANIC', 'RECEPTIONIST'), controller.create);
router.put('/:id', authorize('ADMIN', 'MANAGER', 'MECHANIC'), controller.update);
router.patch('/:id/status', authorize('ADMIN', 'MANAGER', 'MECHANIC'), controller.updateStatus);
router.post('/:id/items', authorize('ADMIN', 'MANAGER', 'MECHANIC'), controller.addItem);
router.delete('/:id/items/:itemId', authorize('ADMIN', 'MANAGER', 'MECHANIC'), controller.removeItem);
router.delete('/:id', authorize('ADMIN', 'MANAGER'), controller.delete);

export default router;
