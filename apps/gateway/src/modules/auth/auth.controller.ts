import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CheckPolicies } from 'src/shared/decorators/check-policies.decorator';
import { PoliciesGuard } from 'src/shared/guards/policies.guard';
import { Action } from 'src/shared/casl/action.enum';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { LoginDto } from './dto/login.dto';
import { MeResponse } from './dto/me.response.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe' })
  @Throttle({ short: { limit: 3, ttl: 60000 } }) // 3 registros por minuto
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 intentos de login por minuto
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard, PoliciesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Role.OWNER, Role.ADMIN, Role.USER) // Roles requeridos antes de validar permisos
  @CheckPolicies((ability) => ability.can(Action.Read, 'Profile'))
  getProfile(@Request() req): Promise<MeResponse> {
    const authHeader = req.headers?.authorization as string | undefined;
    return this.authService.getProfile(req.user.userId, authHeader);
  }
}