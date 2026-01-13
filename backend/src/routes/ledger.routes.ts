import { Router } from 'express';
import { LedgerController } from '../controllers/LedgerController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
const ledgerController = new LedgerController();

router.use(authenticate);

router.get('/', ledgerController.list);
router.get('/summary', ledgerController.getSummary);
router.get('/:id', ledgerController.getById);
router.post('/', authorize('ADMIN', 'MANAGER'), ledgerController.create);
router.put('/:id', authorize('ADMIN', 'MANAGER'), ledgerController.update);
router.delete('/:id', authorize('ADMIN'), ledgerController.delete);

export default router;
