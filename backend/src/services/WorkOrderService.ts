import { PrismaClient, WorkOrderStatus } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class WorkOrderService {
  async list(params: {
    page: number;
    limit: number;
    status?: string;
    clientId?: string;
  }) {
    const { page, limit, status, clientId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    const [workOrders, total] = await Promise.all([
      prisma.workOrder.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: { select: { id: true, name: true, phone: true } },
          assignedTo: { select: { id: true, name: true } },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.workOrder.count({ where }),
    ]);

    return {
      data: workOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        client: true,
        vehicle: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        items: true,
        statusHistory: { orderBy: { changedAt: 'desc' } },
      },
    });

    if (!workOrder) {
      throw AppError.notFound('Work order not found');
    }

    return workOrder;
  }

  async create(data: any, createdById: string) {
    const { items, ...workOrderData } = data;

    return prisma.$transaction(async (tx) => {
      // Create work order
      const workOrder = await tx.workOrder.create({
        data: {
          ...workOrderData,
          createdById,
        },
      });

      // Create items if provided
      if (items && items.length > 0) {
        await tx.workOrderItem.createMany({
          data: items.map((item: any) => ({
            ...item,
            workOrderId: workOrder.id,
            totalPrice: item.quantity * item.unitPrice,
          })),
        });

        // Calculate total
        const total = items.reduce(
          (sum: number, item: any) => sum + item.quantity * item.unitPrice,
          0
        );

        // Update work order with total
        await tx.workOrder.update({
          where: { id: workOrder.id },
          data: {
            totalValue: total,
            finalValue: total,
          },
        });
      }

      // Create status history
      await tx.statusHistory.create({
        data: {
          workOrderId: workOrder.id,
          toStatus: workOrder.status,
        },
      });

      return this.getById(workOrder.id);
    });
  }

  async update(id: string, data: any) {
    await this.getById(id);

    return prisma.workOrder.update({
      where: { id },
      data,
      include: {
        client: true,
        items: true,
      },
    });
  }

  async updateStatus(id: string, status: WorkOrderStatus) {
    const workOrder = await this.getById(id);

    return prisma.$transaction(async (tx) => {
      // Update work order
      const updated = await tx.workOrder.update({
        where: { id },
        data: { status },
      });

      // Create status history
      await tx.statusHistory.create({
        data: {
          workOrderId: id,
          fromStatus: workOrder.status,
          toStatus: status,
        },
      });

      return updated;
    });
  }

  async delete(id: string) {
    await this.getById(id);

    return prisma.workOrder.delete({
      where: { id },
    });
  }
}
