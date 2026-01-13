import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

const createClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().min(10, 'Telefone deve ter no mínimo 10 dígitos'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos').optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

const updateClientSchema = createClientSchema.partial();

export class ClientController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search, isActive } = req.query;

      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: String(search), mode: 'insensitive' } },
          { phone: { contains: String(search) } },
          { cpf: { contains: String(search) } },
          { email: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          where,
          include: {
            _count: {
              select: { vehicles: true, workOrders: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.client.count({ where }),
      ]);

      res.json({
        success: true,
        data: clients,
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

      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          vehicles: true,
          workOrders: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              vehicle: true,
            },
          },
        },
      });

      if (!client) {
        throw new AppError('Cliente não encontrado', 404);
      }

      res.json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createClientSchema.parse(req.body);

      // Check if CPF already exists
      if (data.cpf) {
        const existing = await prisma.client.findUnique({
          where: { cpf: data.cpf },
        });
        if (existing) {
          throw new AppError('CPF já cadastrado', 400);
        }
      }

      // Check if email already exists
      if (data.email) {
        const existing = await prisma.client.findUnique({
          where: { email: data.email },
        });
        if (existing) {
          throw new AppError('Email já cadastrado', 400);
        }
      }

      const client = await prisma.client.create({
        data,
      });

      res.status(201).json({
        success: true,
        data: client,
        message: 'Cliente criado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateClientSchema.parse(req.body);

      // Check if client exists
      const existing = await prisma.client.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError('Cliente não encontrado', 404);
      }

      // Check CPF uniqueness if changed
      if (data.cpf && data.cpf !== existing.cpf) {
        const cpfExists = await prisma.client.findUnique({
          where: { cpf: data.cpf },
        });
        if (cpfExists) {
          throw new AppError('CPF já cadastrado', 400);
        }
      }

      const client = await prisma.client.update({
        where: { id },
        data,
      });

      res.json({
        success: true,
        data: client,
        message: 'Cliente atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Soft delete
      await prisma.client.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({
        success: true,
        message: 'Cliente excluído com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const [total, active, withVehicles, recentClients] = await Promise.all([
        prisma.client.count(),
        prisma.client.count({ where: { isActive: true } }),
        prisma.client.count({
          where: {
            vehicles: {
              some: {},
            },
          },
        }),
        prisma.client.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        }),
      ]);

      res.json({
        success: true,
        data: {
          total,
          active,
          inactive: total - active,
          withVehicles,
          recentClients,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
