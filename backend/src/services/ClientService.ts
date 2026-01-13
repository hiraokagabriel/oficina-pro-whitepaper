import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class ClientService {
  async list(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { cpf: { contains: search } },
            { cnpj: { contains: search } },
          ],
        }
      : {};

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.client.count({ where }),
    ]);

    return {
      data: clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        workOrders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        vehicles: true,
      },
    });

    if (!client) {
      throw AppError.notFound('Client not found');
    }

    return client;
  }

  async create(data: any) {
    return prisma.client.create({
      data,
    });
  }

  async update(id: string, data: any) {
    // Check if exists
    await this.getById(id);

    return prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    // Check if exists
    await this.getById(id);

    // Soft delete
    return prisma.client.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
