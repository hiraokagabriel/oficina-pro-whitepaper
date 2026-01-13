import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

router.get('/me', userController.getProfile);
router.get('/', authorize('ADMIN', 'MANAGER'), userController.list);
router.get('/:id', authorize('ADMIN', 'MANAGER'), userController.getById);
router.put('/me', userController.updateProfile);
router.put('/:id', authorize('ADMIN'), userController.update);
router.delete('/:id', authorize('ADMIN'), userController.delete);

export default router;
