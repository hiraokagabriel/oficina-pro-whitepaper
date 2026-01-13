import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

const createPartSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  description: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().positive(),
  cost: z.number().positive().optional(),
  stock: z.number().int().default(0),
  minStock: z.number().int().default(0),
  maxStock: z.number().int().optional(),
  location: z.string().optional(),
  supplierId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
});

const updatePartSchema = createPartSchema.partial();

const adjustStockSchema = z.object({
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT']),
  quantity: z.number().int(),
  unitPrice: z.number().positive().optional(),
  reason: z.string().optional(),
  reference: z.string().optional(),
});

export class PartController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 50, search, categoryId, supplierId, lowStock } = req.query;

      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: String(search), mode: 'insensitive' } },
          { code: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      if (categoryId) where.categoryId = String(categoryId);
      if (supplierId) where.supplierId = String(supplierId);

      if (lowStock === 'true') {
        where.stock = { lte: prisma.part.fields.minStock };
      }

      const [parts, total] = await Promise.all([
        prisma.part.findMany({
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          where,
          include: {
            supplier: {
              select: { id: true, name: true },
            },
            category: true,
          },
          orderBy: { name: 'asc' },
        }),
        prisma.part.count({ where }),
      ]);

      res.json({
        success: true,
        data: parts,
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

      const part = await prisma.part.findUnique({
        where: { id },
        include: {
          supplier: true,
          category: true,
          movements: {
            take: 20,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!part) {
        throw new AppError('Peça não encontrada', 404);
      }

      res.json({
        success: true,
        data: part,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createPartSchema.parse(req.body);

      // Check if code already exists
      const existing = await prisma.part.findUnique({
        where: { code: data.code },
      });

      if (existing) {
        throw new AppError('Código já cadastrado', 400);
      }

      const part = await prisma.part.create({
        data,
        include: {
          supplier: true,
          category: true,
        },
      });

      res.status(201).json({
        success: true,
        data: part,
        message: 'Peça cadastrada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updatePartSchema.parse(req.body);

      const part = await prisma.part.update({
        where: { id },
        data,
        include: {
          supplier: true,
          category: true,
        },
      });

      res.json({
        success: true,
        data: part,
        message: 'Peça atualizada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async adjustStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = adjustStockSchema.parse(req.body);

      const part = await prisma.part.findUnique({ where: { id } });
      if (!part) {
        throw new AppError('Peça não encontrada', 404);
      }

      let newStock = part.stock;
      if (data.type === 'IN') {
        newStock += data.quantity;
      } else if (data.type === 'OUT') {
        newStock -= data.quantity;
        if (newStock < 0) {
          throw new AppError('Estoque insuficiente', 400);
        }
      } else {
        newStock = data.quantity;
      }

      const [updatedPart] = await prisma.$transaction([
        prisma.part.update({
          where: { id },
          data: { stock: newStock },
        }),
        prisma.stockMovement.create({
          data: {
            partId: id,
            type: data.type,
            quantity: data.quantity,
            unitPrice: data.unitPrice,
            totalPrice: data.unitPrice ? data.unitPrice * data.quantity : undefined,
            reason: data.reason,
            reference: data.reference,
          },
        }),
      ]);

      res.json({
        success: true,
        data: updatedPart,
        message: 'Estoque ajustado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.part.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({
        success: true,
        message: 'Peça excluída com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const parts = await prisma.$queryRaw`
        SELECT * FROM parts
        WHERE stock <= min_stock AND is_active = true
        ORDER BY (min_stock - stock) DESC
        LIMIT 20
      `;

      res.json({
        success: true,
        data: parts,
      });
    } catch (error) {
      next(error);
    }
  }
}
