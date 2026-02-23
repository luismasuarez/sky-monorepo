import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from 'src/shared/strategies/jwt.strategy';
import { CaslModule } from 'src/shared/casl/casl.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PoliciesGuard } from 'src/shared/guards/policies.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Module({
  imports: [
    PassportModule,
    CaslModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return {
          secret,
          signOptions: { expiresIn: '7d' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    PoliciesGuard,
  ],
  exports: [AuthService],
})
export class AuthModule { }