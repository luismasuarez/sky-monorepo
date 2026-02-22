import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { StripeService } from './stripe.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: jest.Mocked<PrismaService>;
  let stripe: jest.Mocked<StripeService>;

  const mockPrismaService = {
    booking: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    payment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
  };

  const mockStripeService = {
    createPaymentIntent: jest.fn(),
    retrievePaymentIntent: jest.fn(),
    createRefund: jest.fn(),
    constructWebhookEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: StripeService,
          useValue: mockStripeService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
    stripe = module.get(StripeService) as jest.Mocked<StripeService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPaymentIntent', () => {
    const userId = 'user_123';
    const bookingId = 'booking_456';

    it('should create a payment intent for a valid booking', async () => {
      const mockBooking = {
        id: bookingId,
        guestId: userId,
        totalPrice: 100.00,
        status: 'CONFIRMED',
        property: {
          title: 'Beautiful Apartment',
          hostId: 'host_123',
        },
      };

      const mockPaymentIntent = {
        id: 'pi_123',
        client_secret: 'secret_123',
        amount: 10000,
      };

      const mockPayment = {
        id: 'payment_123',
        bookingId,
        amount: 100.00,
        currency: 'usd',
        stripePaymentIntentId: 'pi_123',
        status: 'PENDING',
      };

      prisma.booking.findUnique.mockResolvedValue(mockBooking as any);
      prisma.payment.findUnique.mockResolvedValue(null);
      stripe.createPaymentIntent.mockResolvedValue(mockPaymentIntent as any);
      prisma.payment.upsert.mockResolvedValue(mockPayment as any);

      const result = await service.createPaymentIntent({ bookingId }, userId);

      expect(result).toEqual({
        clientSecret: 'secret_123',
        paymentIntentId: 'pi_123',
        amount: 100.00,
        payment: mockPayment,
      });
      expect(prisma.booking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingId },
        include: {
          property: {
            select: {
              title: true,
              hostId: true,
            },
          },
        },
      });
      expect(stripe.createPaymentIntent).toHaveBeenCalledWith(
        100.00,
        'usd',
        {
          bookingId: bookingId,
          guestId: userId,
          propertyTitle: 'Beautiful Apartment',
        }
      );
    });

    it('should throw NotFoundException if booking does not exist', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);

      await expect(
        service.createPaymentIntent({ bookingId: 'invalid' }, 'user_123')
      ).rejects.toThrow(NotFoundException);

      expect(prisma.booking.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw ForbiddenException if user is not the guest', async () => {
      const mockBooking = {
        id: bookingId,
        guestId: 'other_user',
        totalPrice: 100.00,
        status: 'CONFIRMED',
        property: {
          title: 'Beautiful Apartment',
          hostId: 'host_123',
        },
      };

      prisma.booking.findUnique.mockResolvedValue(mockBooking as any);

      await expect(
        service.createPaymentIntent({ bookingId }, 'user_123')
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if booking is not confirmed', async () => {
      const mockBooking = {
        id: bookingId,
        guestId: userId,
        totalPrice: 100.00,
        status: 'PENDING',
        property: {
          title: 'Beautiful Apartment',
          hostId: 'host_123',
        },
      };

      prisma.booking.findUnique.mockResolvedValue(mockBooking as any);

      await expect(
        service.createPaymentIntent({ bookingId }, userId)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if booking is already paid', async () => {
      const mockBooking = {
        id: bookingId,
        guestId: userId,
        totalPrice: 100.00,
        status: 'CONFIRMED',
        property: {
          title: 'Beautiful Apartment',
          hostId: 'host_123',
        },
      };

      const existingPayment = {
        id: 'payment_123',
        bookingId,
        status: 'COMPLETED',
      };

      prisma.booking.findUnique.mockResolvedValue(mockBooking as any);
      prisma.payment.findUnique.mockResolvedValue(existingPayment as any);

      await expect(
        service.createPaymentIntent({ bookingId }, userId)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('confirmPayment', () => {
    it('should confirm a successful payment', async () => {
      const paymentIntentId = 'pi_123';
      const bookingId = 'booking_456';
      const userId = 'user_123';

      const mockPaymentIntent = {
        id: paymentIntentId,
        status: 'succeeded',
      };

      const mockPayment = {
        id: 'payment_123',
        bookingId,
        status: 'COMPLETED',
        paidAt: new Date(),
      };

      stripe.retrievePaymentIntent.mockResolvedValue(mockPaymentIntent as any);
      prisma.payment.update.mockResolvedValue(mockPayment as any);
      prisma.booking.update.mockResolvedValue({} as any);

      const result = await service.confirmPayment(
        { paymentIntentId, bookingId },
        userId
      );

      expect(result).toEqual(mockPayment);
      expect(stripe.retrievePaymentIntent).toHaveBeenCalledWith(paymentIntentId);
      expect(prisma.payment.update).toHaveBeenCalledWith({
        where: { bookingId },
        data: {
          status: 'COMPLETED',
          paidAt: expect.any(Date),
        },
      });
      expect(prisma.booking.update).toHaveBeenCalledWith({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
        },
      });
    });

    it('should throw BadRequestException if payment is not successful', async () => {
      const paymentIntentId = 'pi_123';
      const bookingId = 'booking_456';
      const userId = 'user_123';

      const mockPaymentIntent = {
        id: paymentIntentId,
        status: 'requires_payment_method',
      };

      stripe.retrievePaymentIntent.mockResolvedValue(mockPaymentIntent as any);

      await expect(
        service.confirmPayment({ paymentIntentId, bookingId }, userId)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getPaymentByBooking', () => {
    const bookingId = 'booking_456';
    const userId = 'user_123';

    it('should return payment for guest user', async () => {
      const mockBooking = {
        id: bookingId,
        guestId: userId,
        property: {
          hostId: 'host_123',
        },
      };

      const mockPayment = {
        id: 'payment_123',
        bookingId,
        status: 'COMPLETED',
        booking: mockBooking,
      };

      prisma.booking.findUnique.mockResolvedValue(mockBooking as any);
      prisma.payment.findUnique.mockResolvedValue(mockPayment as any);

      const result = await service.getPaymentByBooking(bookingId, userId);

      expect(result).toEqual(mockPayment);
    });

    it('should throw NotFoundException if booking does not exist', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);

      await expect(
        service.getPaymentByBooking('invalid', userId)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not guest or host', async () => {
      const mockBooking = {
        id: bookingId,
        guestId: 'other_guest',
        property: {
          hostId: 'other_host',
        },
      };

      prisma.booking.findUnique.mockResolvedValue(mockBooking as any);

      await expect(
        service.getPaymentByBooking(bookingId, userId)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if payment does not exist', async () => {
      const mockBooking = {
        id: bookingId,
        guestId: userId,
        property: {
          hostId: 'host_123',
        },
      };

      prisma.booking.findUnique.mockResolvedValue(mockBooking as any);
      prisma.payment.findUnique.mockResolvedValue(null);

      await expect(
        service.getPaymentByBooking(bookingId, userId)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('refundPayment', () => {
    const paymentId = 'payment_123';
    const hostId = 'host_123';

    it('should refund a completed payment', async () => {
      const mockPayment = {
        id: paymentId,
        status: 'COMPLETED',
        stripePaymentIntentId: 'pi_123',
        bookingId: 'booking_456',
        amount: 100.00,
        booking: {
          property: {
            hostId: hostId,
          },
        },
      };

      const mockRefund = {
        id: 'refund_123',
        status: 'succeeded',
      };

      const mockUpdatedPayment = {
        ...mockPayment,
        status: 'REFUNDED',
      };

      prisma.payment.findUnique.mockResolvedValue(mockPayment as any);
      stripe.createRefund.mockResolvedValue(mockRefund as any);
      prisma.payment.update.mockResolvedValue(mockUpdatedPayment as any);
      prisma.booking.update.mockResolvedValue({} as any);

      const result = await service.refundPayment(paymentId, hostId);

      expect(result.payment.status).toBe('REFUNDED');
      expect(result.refund).toEqual(mockRefund);
      expect(stripe.createRefund).toHaveBeenCalledWith('pi_123', 100.00);
    });

    it('should throw NotFoundException if payment does not exist', async () => {
      prisma.payment.findUnique.mockResolvedValue(null);

      await expect(
        service.refundPayment('invalid', hostId)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the host', async () => {
      const mockPayment = {
        id: paymentId,
        status: 'COMPLETED',
        stripePaymentIntentId: 'pi_123',
        bookingId: 'booking_456',
        amount: 100.00,
        booking: {
          property: {
            hostId: 'other_host',
          },
        },
      };

      prisma.payment.findUnique.mockResolvedValue(mockPayment as any);

      await expect(
        service.refundPayment(paymentId, 'user_123')
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if payment is not completed', async () => {
      const mockPayment = {
        id: paymentId,
        status: 'PENDING',
        stripePaymentIntentId: 'pi_123',
        bookingId: 'booking_456',
        booking: {
          property: {
            hostId: hostId,
          },
        },
      };

      prisma.payment.findUnique.mockResolvedValue(mockPayment as any);

      await expect(
        service.refundPayment(paymentId, hostId)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if payment intent ID is missing', async () => {
      const mockPayment = {
        id: paymentId,
        status: 'COMPLETED',
        stripePaymentIntentId: null,
        bookingId: 'booking_456',
        booking: {
          property: {
            hostId: hostId,
          },
        },
      };

      prisma.payment.findUnique.mockResolvedValue(mockPayment as any);

      await expect(
        service.refundPayment(paymentId, hostId)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('handleWebhook', () => {
    it('should handle payment_intent.succeeded event', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
          },
        },
      };

      const mockPayment = {
        id: 'payment_123',
        bookingId: 'booking_456',
      };

      stripe.constructWebhookEvent.mockResolvedValue(mockEvent as any);
      prisma.payment.findFirst.mockResolvedValue(mockPayment as any);
      prisma.payment.update.mockResolvedValue({} as any);
      prisma.booking.update.mockResolvedValue({} as any);

      const result = await service.handleWebhook(
        Buffer.from('test'),
        'signature'
      );

      expect(result).toEqual({ received: true });
      expect(prisma.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment_123' },
        data: {
          status: 'COMPLETED',
          paidAt: expect.any(Date),
        },
      });
    });

    it('should handle payment_intent.payment_failed event', async () => {
      const mockEvent = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_123',
          },
        },
      };

      const mockPayment = {
        id: 'payment_123',
        bookingId: 'booking_456',
      };

      stripe.constructWebhookEvent.mockResolvedValue(mockEvent as any);
      prisma.payment.findFirst.mockResolvedValue(mockPayment as any);
      prisma.payment.update.mockResolvedValue({} as any);

      const result = await service.handleWebhook(
        Buffer.from('test'),
        'signature'
      );

      expect(result).toEqual({ received: true });
      expect(prisma.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment_123' },
        data: {
          status: 'FAILED',
        },
      });
    });

    it('should handle charge.refunded event', async () => {
      const mockEvent = {
        type: 'charge.refunded',
        data: {
          object: {
            payment_intent: 'pi_123',
          },
        },
      };

      const mockPayment = {
        id: 'payment_123',
        bookingId: 'booking_456',
      };

      stripe.constructWebhookEvent.mockResolvedValue(mockEvent as any);
      prisma.payment.findFirst.mockResolvedValue(mockPayment as any);
      prisma.payment.update.mockResolvedValue({} as any);
      prisma.booking.update.mockResolvedValue({} as any);

      const result = await service.handleWebhook(
        Buffer.from('test'),
        'signature'
      );

      expect(result).toEqual({ received: true });
      expect(prisma.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment_123' },
        data: {
          status: 'REFUNDED',
        },
      });
      expect(prisma.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking_456' },
        data: {
          status: 'REFUNDED',
        },
      });
    });
  });
});
