import { Router } from 'express';
import { LedgerController } from '../controllers/ledger.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
const controller = new LedgerController();

router.use(authenticate);

router.get('/summary', controller.getSummary);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authorize('ADMIN', 'MANAGER'), controller.create);
router.put('/:id', authorize('ADMIN', 'MANAGER'), controller.update);
router.delete('/:id', authorize('ADMIN', 'MANAGER'), controller.delete);

export default router;
