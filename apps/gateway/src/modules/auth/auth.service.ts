import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../shared/services/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roles: ['USER'], // Default role as array
      },
    });

    const jti = randomUUID();
    const expiresInRaw = this.configService.get<string>('JWT_EXPIRES_IN') || '3600';
    const expiresInSec = Number.parseInt(expiresInRaw, 10) || 3600;
    const exp = Math.floor(Date.now() / 1000) + expiresInSec;
    const payload = { email: user.email, sub: user.id, jti, exp };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: (user.roles || []).map((r) => String(r).toLowerCase()),
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jti = randomUUID();
    const expiresInRaw = this.configService.get<string>('JWT_EXPIRES_IN') || '3600';
    const expiresInSec = Number.parseInt(expiresInRaw, 10) || 3600;
    const exp = Math.floor(Date.now() / 1000) + expiresInSec;
    const payload = { email: user.email, sub: user.id, jti, exp };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: (user.roles || []).map((r) => String(r).toLowerCase()),
      },
      token,
    };
  }

  async getProfile(userId: string, authHeader?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        username: true,
        roles: true,
        permissions: true,
        avatar: true,
        preferences: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const prefs = (user.preferences || null) as any;

    const profile = {
      avatar: user.avatar || null,
      locale: prefs?.locale || null,
      preferences: prefs || null,
    };

    let session: { sessionId?: string; tokenExpiresAt?: string } | undefined;
    try {
      const header = authHeader || '';
      if (header.startsWith('Bearer ')) {
        const token = header.split(' ')[1];
        const decoded = this.jwtService.decode(token) as any | null;
        if (decoded) {
          session = {};
          if (decoded.jti) {
            session.sessionId = decoded.jti;
          }
          if (decoded.exp) {
            session.tokenExpiresAt = new Date(decoded.exp * 1000).toISOString();
          }
        }
      }
    } catch (e) {
      // ignore decoding errors
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone || null,
      name: user.name || null,
      username: user.username || null,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt.toISOString(),
      roles: (user.roles || []).map((r) => String(r).toLowerCase()),
      permissions: user.permissions || [],
      profile,
      session,
    };
  }
}