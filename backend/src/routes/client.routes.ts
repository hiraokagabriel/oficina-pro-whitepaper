import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
const controller = new ClientController();

router.use(authenticate);

router.get('/statistics', controller.getStatistics);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authorize('ADMIN', 'MANAGER', 'RECEPTIONIST'), controller.create);
router.put('/:id', authorize('ADMIN', 'MANAGER', 'RECEPTIONIST'), controller.update);
router.delete('/:id', authorize('ADMIN', 'MANAGER'), controller.delete);

export default router;
