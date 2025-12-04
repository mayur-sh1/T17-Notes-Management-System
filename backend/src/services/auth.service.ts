import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/encryption';
import { JwtUserPayload } from '../types';

export class AuthService {
  static async register(email: string, username: string, password: string) {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  static async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    };
  }

  static generateToken(payload: {
    id: string;
    email: string;
    username: string;
    role: string;
  }): string {
    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }
}

