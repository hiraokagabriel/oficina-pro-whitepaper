import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

const createServiceSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser positivo'),
  estimatedTime: z.number().positive().optional(),
  categoryId: z.string().uuid().optional(),
});

const updateServiceSchema = createServiceSchema.partial();

export class ServiceController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 50, search, categoryId, isActive } = req.query;

      const where: any = {};

      if (search) {
        where.name = { contains: String(search), mode: 'insensitive' };
      }

      if (categoryId) {
        where.categoryId = String(categoryId);
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const [services, total] = await Promise.all([
        prisma.service.findMany({
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          where,
          include: {
            category: true,
          },
          orderBy: { name: 'asc' },
        }),
        prisma.service.count({ where }),
      ]);

      res.json({
        success: true,
        data: services,
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

      const service = await prisma.service.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!service) {
        throw new AppError('Serviço não encontrado', 404);
      }

      res.json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createServiceSchema.parse(req.body);

      const service = await prisma.service.create({
        data,
        include: {
          category: true,
        },
      });

      res.status(201).json({
        success: true,
        data: service,
        message: 'Serviço criado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateServiceSchema.parse(req.body);

      const service = await prisma.service.update({
        where: { id },
        data,
        include: {
          category: true,
        },
      });

      res.json({
        success: true,
        data: service,
        message: 'Serviço atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Soft delete
      await prisma.service.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({
        success: true,
        message: 'Serviço excluído com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}
