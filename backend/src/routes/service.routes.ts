import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
const serviceController = new ServiceController();

router.use(authenticate);

router.get('/', serviceController.list);
router.get('/:id', serviceController.getById);
router.post('/', authorize('ADMIN', 'MANAGER'), serviceController.create);
router.put('/:id', authorize('ADMIN', 'MANAGER'), serviceController.update);
router.delete('/:id', authorize('ADMIN'), serviceController.delete);

export default router;
