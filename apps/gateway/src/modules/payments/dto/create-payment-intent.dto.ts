import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: 'ID de la reserva para la cual se creará el pago',
    example: 'clx1234567890',
  })
  @IsString({ message: 'El ID de reserva debe ser una cadena de texto' })
  bookingId: string;

  @ApiPropertyOptional({
    description: 'Metadatos adicionales para el pago',
    example: { orderId: '123', customerId: 'user_456' },
  })
  @IsOptional()
  @IsObject({ message: 'Los metadatos deben ser un objeto' })
  metadata?: Record<string, any>;
}