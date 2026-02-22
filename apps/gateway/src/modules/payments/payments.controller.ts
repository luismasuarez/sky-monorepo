import type { RawBodyRequest } from '@nestjs/common';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import type { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un Payment Intent para una reserva' })
  @ApiResponse({ status: 201, description: 'Payment Intent creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 requests por minuto
  @HttpCode(HttpStatus.CREATED)
  createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto, @Request() req) {
    return this.paymentsService.createPaymentIntent(createPaymentIntentDto, req.user.userId);
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirmar un pago' })
  @ApiResponse({ status: 200, description: 'Pago confirmado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 requests por minuto
  @HttpCode(HttpStatus.OK)
  confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto, @Request() req) {
    return this.paymentsService.confirmPayment(confirmPaymentDto, req.user.userId);
  }

  @Get('booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener pago por ID de reserva' })
  @ApiResponse({ status: 200, description: 'Pago obtenido exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  getPaymentByBooking(@Param('bookingId') bookingId: string, @Request() req) {
    return this.paymentsService.getPaymentByBooking(bookingId, req.user.userId);
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reembolsar un pago' })
  @ApiResponse({ status: 200, description: 'Reembolso procesado exitosamente' })
  @ApiResponse({ status: 400, description: 'No se puede reembolsar este pago' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  @Throttle({ short: { limit: 3, ttl: 60000 } }) // 3 requests por minuto (más restrictivo)
  @HttpCode(HttpStatus.OK)
  refundPayment(@Param('id') id: string, @Request() req) {
    return this.paymentsService.refundPayment(id, req.user.userId);
  }

  @Post('webhook')
  @SkipThrottle() // No aplicar rate limiting a webhooks de Stripe
  @ApiOperation({ summary: 'Webhook de Stripe para procesar eventos de pago' })
  @ApiResponse({ status: 200, description: 'Webhook procesado exitosamente' })
  @ApiResponse({ status: 400, description: 'Firma inválida o cuerpo faltante' })
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: RawBodyRequest<ExpressRequest>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body');
    }
    return this.paymentsService.handleWebhook(req.rawBody, signature);
  }
}