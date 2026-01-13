import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { strictRateLimiter } from '../middlewares/rateLimiter';
import { authenticate } from '../middlewares/auth';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', strictRateLimiter, authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);

export default router;
