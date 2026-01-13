import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

const createLedgerSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().positive(),
  description: z.string().min(2),
  category: z.string().optional(),
  date: z.string().datetime(),
  workOrderId: z.string().uuid().optional(),
  isPaid: z.boolean().default(false),
  paymentMethod: z.string().optional(),
});

const updateLedgerSchema = createLedgerSchema.partial();

export class LedgerController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, type, startDate, endDate, category, isPaid } = req.query;

      const where: any = {};

      if (type) where.type = String(type);
      if (category) where.category = String(category);
      if (isPaid !== undefined) where.isPaid = isPaid === 'true';

      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(String(startDate));
        if (endDate) where.date.lte = new Date(String(endDate));
      }

      const [entries, total] = await Promise.all([
        prisma.ledgerEntry.findMany({
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          where,
          include: {
            workOrder: {
              select: {
                id: true,
                client: {
                  select: { name: true },
                },
              },
            },
            createdBy: {
              select: { id: true, name: true },
            },
          },
          orderBy: { date: 'desc' },
        }),
        prisma.ledgerEntry.count({ where }),
      ]);

      res.json({
        success: true,
        data: entries,
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

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;

      const where: any = {};
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(String(startDate));
        if (endDate) where.date.lte = new Date(String(endDate));
      }

      const [income, expense, byCategory] = await Promise.all([
        prisma.ledgerEntry.aggregate({
          where: { ...where, type: 'INCOME' },
          _sum: { amount: true },
        }),
        prisma.ledgerEntry.aggregate({
          where: { ...where, type: 'EXPENSE' },
          _sum: { amount: true },
        }),
        prisma.ledgerEntry.groupBy({
          by: ['type', 'category'],
          where,
          _sum: { amount: true },
        }),
      ]);

      const totalIncome = Number(income._sum.amount || 0);
      const totalExpense = Number(expense._sum.amount || 0);
      const balance = totalIncome - totalExpense;

      res.json({
        success: true,
        data: {
          totalIncome,
          totalExpense,
          balance,
          byCategory: byCategory.map((item) => ({
            type: item.type,
            category: item.category || 'Sem categoria',
            amount: Number(item._sum.amount || 0),
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const entry = await prisma.ledgerEntry.findUnique({
        where: { id },
        include: {
          workOrder: {
            include: {
              client: true,
            },
          },
          createdBy: {
            select: { id: true, name: true },
          },
        },
      });

      if (!entry) {
        throw new AppError('Lançamento não encontrado', 404);
      }

      res.json({
        success: true,
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createLedgerSchema.parse(req.body);
      const userId = req.user!.id;

      const entry = await prisma.ledgerEntry.create({
        data: {
          ...data,
          date: new Date(data.date),
          createdById: userId,
        },
      });

      res.status(201).json({
        success: true,
        data: entry,
        message: 'Lançamento criado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateLedgerSchema.parse(req.body);

      const updateData: any = { ...data };
      if (data.date) {
        updateData.date = new Date(data.date);
      }

      const entry = await prisma.ledgerEntry.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        data: entry,
        message: 'Lançamento atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.ledgerEntry.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Lançamento excluído com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}
