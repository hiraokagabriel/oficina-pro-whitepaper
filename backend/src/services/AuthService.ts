import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    name: string;
    role?: 'ADMIN' | 'MANAGER' | 'MECHANIC' | 'RECEPTIONIST';
  }) {
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw AppError.conflict('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || 'MECHANIC',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Save refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return { user, ...tokens };
  }

  async login(data: { email: string; password: string }) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw AppError.unauthorized('Invalid credentials');
    }

    if (!user.isActive) {
      throw AppError.unauthorized('Account disabled');
    }

    // Verify password
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      throw AppError.unauthorized('Invalid credentials');
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Save refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, ...tokens };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        id: string;
        email: string;
        role: string;
      };

      // Check if token exists in DB
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken) {
        throw AppError.unauthorized('Invalid refresh token');
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || !user.isActive) {
        throw AppError.unauthorized('User not found or inactive');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      // Delete old refresh token and save new one
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
      await this.saveRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw AppError.unauthorized('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    try {
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
    } catch (error) {
      // Token doesn't exist, ignore
    }
  }

  private generateTokens(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }
}
