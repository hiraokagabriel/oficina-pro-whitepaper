import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
const controller = new VehicleController();

router.use(authenticate);

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authorize('ADMIN', 'MANAGER', 'RECEPTIONIST'), controller.create);
router.put('/:id', authorize('ADMIN', 'MANAGER', 'RECEPTIONIST'), controller.update);
router.delete('/:id', authorize('ADMIN', 'MANAGER'), controller.delete);

export default router;
