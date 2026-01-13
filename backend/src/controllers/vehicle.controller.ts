import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

const createVehicleSchema = z.object({
  clientId: z.string().uuid('ID do cliente inválido'),
  brand: z.string().min(2, 'Marca deve ter no mínimo 2 caracteres'),
  model: z.string().min(2, 'Modelo deve ter no mínimo 2 caracteres'),
  year: z.number().int().min(1900).max(2030).optional(),
  plate: z.string().optional(),
  vin: z.string().optional(),
  color: z.string().optional(),
  mileage: z.number().int().optional(),
  notes: z.string().optional(),
});

const updateVehicleSchema = createVehicleSchema.partial();

export class VehicleController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, clientId, search } = req.query;

      const where: any = {};

      if (clientId) {
        where.clientId = String(clientId);
      }

      if (search) {
        where.OR = [
          { brand: { contains: String(search), mode: 'insensitive' } },
          { model: { contains: String(search), mode: 'insensitive' } },
          { plate: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      const [vehicles, total] = await Promise.all([
        prisma.vehicle.findMany({
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          where,
          include: {
            client: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
            _count: {
              select: { workOrders: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.vehicle.count({ where }),
      ]);

      res.json({
        success: true,
        data: vehicles,
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

      const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: {
          client: true,
          workOrders: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              status: true,
              createdAt: true,
              total: true,
            },
          },
        },
      });

      if (!vehicle) {
        throw new AppError('Veículo não encontrado', 404);
      }

      res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createVehicleSchema.parse(req.body);

      // Check if client exists
      const client = await prisma.client.findUnique({
        where: { id: data.clientId },
      });

      if (!client) {
        throw new AppError('Cliente não encontrado', 404);
      }

      // Check if plate already exists
      if (data.plate) {
        const existing = await prisma.vehicle.findUnique({
          where: { plate: data.plate },
        });
        if (existing) {
          throw new AppError('Placa já cadastrada', 400);
        }
      }

      const vehicle = await prisma.vehicle.create({
        data,
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        data: vehicle,
        message: 'Veículo cadastrado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateVehicleSchema.parse(req.body);

      // Check if vehicle exists
      const existing = await prisma.vehicle.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError('Veículo não encontrado', 404);
      }

      // Check plate uniqueness if changed
      if (data.plate && data.plate !== existing.plate) {
        const plateExists = await prisma.vehicle.findUnique({
          where: { plate: data.plate },
        });
        if (plateExists) {
          throw new AppError('Placa já cadastrada', 400);
        }
      }

      const vehicle = await prisma.vehicle.update({
        where: { id },
        data,
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: vehicle,
        message: 'Veículo atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.vehicle.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Veículo excluído com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}
