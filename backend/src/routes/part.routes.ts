import { Router } from 'express';
import { PartController } from '../controllers/PartController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
const partController = new PartController();

router.use(authenticate);

router.get('/', partController.list);
router.get('/:id', partController.getById);
router.post('/', authorize('ADMIN', 'MANAGER'), partController.create);
router.put('/:id', authorize('ADMIN', 'MANAGER'), partController.update);
router.delete('/:id', authorize('ADMIN'), partController.delete);

export default router;
