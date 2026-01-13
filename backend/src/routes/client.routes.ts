import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createClientSchema, updateClientSchema } from '../schemas/client.schema';

const router = Router();
const clientController = new ClientController();

// All routes require authentication
router.use(authenticate);

router.get('/', clientController.list);
router.get('/:id', clientController.getById);
router.post('/', validate(createClientSchema), clientController.create);
router.put('/:id', validate(updateClientSchema), clientController.update);
router.delete('/:id', authorize('ADMIN', 'MANAGER'), clientController.delete);

export default router;
