import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import clientRoutes from './client.routes';
import vehicleRoutes from './vehicle.routes';
import workOrderRoutes from './workOrder.routes';
import serviceRoutes from './service.routes';
import partRoutes from './part.routes';
import ledgerRoutes from './ledger.routes';
import appointmentRoutes from './appointment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/work-orders', workOrderRoutes);
router.use('/services', serviceRoutes);
router.use('/parts', partRoutes);
router.use('/ledger', ledgerRoutes);
router.use('/appointments', appointmentRoutes);

export default router;
