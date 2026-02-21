import type { RawBodyRequest } from '@nestjs/common';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto, @Request() req) {
    return this.paymentsService.createPaymentIntent(createPaymentIntentDto, req.user.userId);
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto, @Request() req) {
    return this.paymentsService.confirmPayment(confirmPaymentDto, req.user.userId);
  }

  @Get('booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  getPaymentByBooking(@Param('bookingId') bookingId: string, @Request() req) {
    return this.paymentsService.getPaymentByBooking(bookingId, req.user.userId);
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard)
  refundPayment(@Param('id') id: string, @Request() req) {
    return this.paymentsService.refundPayment(id, req.user.userId);
  }

  @Post('webhook')
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