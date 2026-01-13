import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class UserService {
  async list() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    return user;
  }

  async update(id: string, data: any) {
    // Check if user exists
    await this.getById(id);

    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  }

  async delete(id: string) {
    // Check if user exists
    await this.getById(id);

    // Soft delete (set isActive to false)
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
