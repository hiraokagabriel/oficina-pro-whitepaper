import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  role: z.enum(['ADMIN', 'MANAGER', 'MECHANIC', 'RECEPTIONIST']),
});

const updateUserSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'MECHANIC', 'RECEPTIONIST']).optional(),
  isActive: z.boolean().optional(),
});

export class UserController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, role, isActive } = req.query;

      const where: any = {};

      if (role) {
        where.role = String(role);
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          where,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            createdAt: true,
            _count: {
              select: {
                workOrders: true,
                createdWorkOrders: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        success: true,
        data: users,
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

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              workOrders: true,
              createdWorkOrders: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError('Usuário não encontrado', 404);
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createUserSchema.parse(req.body);

      // Check if email already exists
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existing) {
        throw new AppError('Email já cadastrado', 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      res.status(201).json({
        success: true,
        data: user,
        message: 'Usuário criado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateUserSchema.parse(req.body);

      // Check if user exists
      const existing = await prisma.user.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError('Usuário não encontrado', 404);
      }

      // Hash password if provided
      const updateData: any = { ...data };
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      res.json({
        success: true,
        data: user,
        message: 'Usuário atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Prevent self-deletion
      if (req.user && req.user.id === id) {
        throw new AppError('Não é possível excluir seu próprio usuário', 400);
      }

      // Soft delete
      await prisma.user.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({
        success: true,
        message: 'Usuário excluído com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}
