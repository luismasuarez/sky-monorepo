import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
    configService = module.get(ConfigService) as jest.Mocked<ConfigService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'Password123',
      name: 'Test User',
    };

    it('should successfully register a new user', async () => {
      const hashedPassword = 'hashed_password';
      const mockUser = {
        id: 'user_123',
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        roles: ['USER'],
        createdAt: new Date(),
      };

      const mockToken = 'jwt_token_123';

      prisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      prisma.user.create.mockResolvedValue(mockUser as any);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          roles: mockUser.roles.map((r: string) => r.toLowerCase()),
        },
        token: mockToken,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
          roles: ['USER'],
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      }, expect.any(Object));
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = {
        id: 'user_123',
        email: registerDto.email,
      };

      prisma.user.findUnique.mockResolvedValue(existingUser as any);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      await expect(service.register(registerDto)).rejects.toThrow('Email already exists');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'Password123',
    };

    it('should successfully login a user with valid credentials', async () => {
      const hashedPassword = 'hashed_password';
      const mockUser = {
        id: 'user_123',
        email: loginDto.email,
        name: 'Test User',
        password: hashedPassword,
        roles: ['GUEST'],
      };

      const mockToken = 'jwt_token_123';

      prisma.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          roles: mockUser.roles.map((r: string) => r.toLowerCase()),
        },
        token: mockToken,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, hashedPassword);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      }, expect.any(Object));
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const hashedPassword = 'hashed_password';
      const mockUser = {
        id: 'user_123',
        email: loginDto.email,
        password: hashedPassword,
      };

      prisma.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, hashedPassword);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    const userId = 'user_123';

    it('should return user profile for valid user', async () => {
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        roles: ['GUEST'],
        avatar: 'https://example.com/avatar.jpg',
        preferences: null,
        phone: null,
        username: null,
        isActive: true,
        isVerified: false,
        permissions: [],
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(mockUser as any);

      const result = await service.getProfile(userId);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        phone: null,
        name: mockUser.name,
        username: null,
        isActive: true,
        isVerified: false,
        createdAt: mockUser.createdAt.toISOString(),
        roles: mockUser.roles.map((r: string) => r.toLowerCase()),
        permissions: [],
        profile: {
          avatar: mockUser.avatar,
          locale: null,
          preferences: null,
        },
        session: undefined,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
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
    });

    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('invalid_user')).rejects.toThrow(UnauthorizedException);
      await expect(service.getProfile('invalid_user')).rejects.toThrow('User not found');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'invalid_user' },
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
    });
  });
});
