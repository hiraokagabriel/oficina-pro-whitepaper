import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
const controller = new UserController();

router.use(authenticate);
router.use(authorize('ADMIN', 'MANAGER'));

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authorize('ADMIN'), controller.create);
router.put('/:id', controller.update);
router.delete('/:id', authorize('ADMIN'), controller.delete);

export default router;
