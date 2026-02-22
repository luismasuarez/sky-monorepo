import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPaymentDto {
  @ApiProperty({
    description: 'ID del Payment Intent de Stripe',
    example: 'pi_1234567890',
  })
  @IsString({ message: 'El Payment Intent ID debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El Payment Intent ID es requerido' })
  paymentIntentId: string;

  @ApiProperty({
    description: 'ID de la reserva asociada al pago',
    example: 'clx1234567890',
  })
  @IsString({ message: 'El ID de reserva debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID de reserva es requerido' })
  bookingId: string;
}