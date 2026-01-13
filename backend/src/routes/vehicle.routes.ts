import { Router } from 'express';
import { VehicleController } from '../controllers/VehicleController';
import { authenticate } from '../middlewares/auth';

const router = Router();
const vehicleController = new VehicleController();

router.use(authenticate);

router.get('/', vehicleController.list);
router.get('/:id', vehicleController.getById);
router.post('/', vehicleController.create);
router.put('/:id', vehicleController.update);
router.delete('/:id', vehicleController.delete);

export default router;
