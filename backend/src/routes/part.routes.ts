import { Router } from 'express';
import { PartController } from '../controllers/part.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
const controller = new PartController();

router.use(authenticate);

router.get('/low-stock', controller.getLowStock);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authorize('ADMIN', 'MANAGER'), controller.create);
router.put('/:id', authorize('ADMIN', 'MANAGER'), controller.update);
router.post('/:id/stock', authorize('ADMIN', 'MANAGER'), controller.adjustStock);
router.delete('/:id', authorize('ADMIN', 'MANAGER'), controller.delete);

export default router;
