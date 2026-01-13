import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

const workOrderItemSchema = z.object({
  type: z.enum(['SERVICE', 'PART']),
  description: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  serviceId: z.string().uuid().optional(),
  partId: z.string().uuid().optional(),
});

const createWorkOrderSchema = z.object({
  clientId: z.string().uuid(),
  vehicleId: z.string().uuid().optional(),
  vehicleDesc: z.string().min(5, 'Descrição do veículo é obrigatória'),
  status: z.enum(['ESTIMATE', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  publicNotes: z.string().optional(),
  internalNotes: z.string().optional(),
  assignedToId: z.string().uuid().optional(),
  items: z.array(workOrderItemSchema).optional(),
});

const updateWorkOrderSchema = createWorkOrderSchema.partial();

const updateStatusSchema = z.object({
  status: z.enum(['ESTIMATE', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELLED']),
  reason: z.string().optional(),
});

export class WorkOrderController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status, clientId, assignedToId, priority } = req.query;

      const where: any = {};

      if (status) where.status = String(status);
      if (clientId) where.clientId = String(clientId);
      if (assignedToId) where.assignedToId = String(assignedToId);
      if (priority) where.priority = String(priority);

      const [workOrders, total] = await Promise.all([
        prisma.workOrder.findMany({
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          where,
          include: {
            client: {
              select: { id: true, name: true, phone: true },
            },
            vehicle: {
              select: { id: true, brand: true, model: true, plate: true },
            },
            assignedTo: {
              select: { id: true, name: true },
            },
            items: true,
            _count: {
              select: { items: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.workOrder.count({ where }),
      ]);

      res.json({
        success: true,
        data: workOrders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const workOrder = await prisma.workOrder.findUnique({
        where: { id },
        include: {
          client: true,
          vehicle: true,
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
          createdBy: {
            select: { id: true, name: true },
          },
          items: {
            include: {
              service: true,
              part: true,
            },
          },
          statusHistory: {
            orderBy: { createdAt: 'desc' },
          },
          attachments: true,
        },
      });

      if (!workOrder) {
        throw new AppError('Ordem de serviço não encontrada', 404);
      }

      res.json({
        success: true,
        data: workOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createWorkOrderSchema.parse(req.body);
      const userId = req.user!.id;

      // Calculate totals from items
      let total = 0;
      const items = data.items || [];

      items.forEach((item) => {
        const subtotal = item.quantity * item.unitPrice;
        total += subtotal;
      });

      const workOrder = await prisma.workOrder.create({
        data: {
          clientId: data.clientId,
          vehicleId: data.vehicleId,
          vehicleDesc: data.vehicleDesc,
          status: data.status || 'ESTIMATE',
          priority: data.priority || 'NORMAL',
          publicNotes: data.publicNotes,
          internalNotes: data.internalNotes,
          assignedToId: data.assignedToId,
          createdById: userId,
          total,
          finalTotal: total,
          items: {
            create: items.map((item) => ({
              type: item.type,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.quantity * item.unitPrice,
              serviceId: item.serviceId,
              partId: item.partId,
            })),
          },
          statusHistory: {
            create: {
              newStatus: data.status || 'ESTIMATE',
              changedBy: userId,
            },
          },
        },
        include: {
          client: true,
          vehicle: true,
          items: true,
        },
      });

      res.status(201).json({
        success: true,
        data: workOrder,
        message: 'Ordem de serviço criada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateWorkOrderSchema.parse(req.body);

      const workOrder = await prisma.workOrder.update({
        where: { id },
        data: {
          vehicleId: data.vehicleId,
          vehicleDesc: data.vehicleDesc,
          publicNotes: data.publicNotes,
          internalNotes: data.internalNotes,
          assignedToId: data.assignedToId,
          priority: data.priority,
        },
        include: {
          client: true,
          vehicle: true,
          items: true,
        },
      });

      res.json({
        success: true,
        data: workOrder,
        message: 'Ordem de serviço atualizada',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, reason } = updateStatusSchema.parse(req.body);
      const userId = req.user!.id;

      const existing = await prisma.workOrder.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError('Ordem de serviço não encontrada', 404);
      }

      const updateData: any = { status };

      // Set timestamps based on status
      if (status === 'APPROVED' && !existing.approvedAt) {
        updateData.approvedAt = new Date();
      } else if (status === 'IN_PROGRESS' && !existing.startedAt) {
        updateData.startedAt = new Date();
      } else if (status === 'COMPLETED' && !existing.finishedAt) {
        updateData.finishedAt = new Date();
      } else if (status === 'DELIVERED' && !existing.deliveredAt) {
        updateData.deliveredAt = new Date();
      }

      const workOrder = await prisma.workOrder.update({
        where: { id },
        data: {
          ...updateData,
          statusHistory: {
            create: {
              oldStatus: existing.status,
              newStatus: status,
              changedBy: userId,
              reason,
            },
          },
        },
        include: {
          statusHistory: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      res.json({
        success: true,
        data: workOrder,
        message: 'Status atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const itemData = workOrderItemSchema.parse(req.body);

      const subtotal = itemData.quantity * itemData.unitPrice;

      const item = await prisma.workOrderItem.create({
        data: {
          workOrderId: id,
          type: itemData.type,
          description: itemData.description,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          subtotal,
          serviceId: itemData.serviceId,
          partId: itemData.partId,
        },
      });

      // Update work order total
      await this.recalculateTotal(id);

      res.status(201).json({
        success: true,
        data: item,
        message: 'Item adicionado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, itemId } = req.params;

      await prisma.workOrderItem.delete({
        where: { id: itemId },
      });

      // Update work order total
      await this.recalculateTotal(id);

      res.json({
        success: true,
        message: 'Item removido com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.workOrder.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Ordem de serviço excluída',
      });
    } catch (error) {
      next(error);
    }
  }

  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const [total, byStatus, recentOrders] = await Promise.all([
        prisma.workOrder.count(),
        prisma.workOrder.groupBy({
          by: ['status'],
          _count: true,
        }),
        prisma.workOrder.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            client: {
              select: { name: true },
            },
          },
        }),
      ]);

      const statusCounts = byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>);

      res.json({
        success: true,
        data: {
          total,
          byStatus: statusCounts,
          recentOrders,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  private async recalculateTotal(workOrderId: string) {
    const items = await prisma.workOrderItem.findMany({
      where: { workOrderId },
    });

    const total = items.reduce((sum, item) => {
      return sum + Number(item.subtotal);
    }, 0);

    await prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        total,
        finalTotal: total,
      },
    });
  }
}
