import { z } from 'zod';

// ==================== OWNER SCHEMAS ====================

/**
 * Owner - Step 1: Account Information
 */
export const ownerAccountSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

/**
 * Owner - Step 2: Organization Configuration
 */
export const ownerOrganizationSchema = z.object({
  organizationName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  workspaceName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  contactEmail: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
});

/**
 * Owner - Step 3: Confirmation
 */
export const ownerConfirmationSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
  acceptPrivacy: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar la política de privacidad',
  }),
});

/**
 * Complete Owner Onboarding Schema
 */
export const ownerOnboardingSchema = z.object({
  ...ownerAccountSchema.shape,
  ...ownerOrganizationSchema.shape,
  ...ownerConfirmationSchema.shape,
});

export type OwnerOnboardingFormData = z.infer<typeof ownerOnboardingSchema>;

// ==================== CONTRIBUTOR SCHEMAS ====================

/**
 * Contributor - Step 1: Account Information
 */
export const contributorAccountSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

/**
 * Contributor - Step 2: Confirmation
 */
export const contributorConfirmationSchema = z.object({
  workspaceName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .default('Mi Espacio'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
});

/**
 * Complete Contributor Onboarding Schema
 */
export const contributorOnboardingSchema = z.object({
  ...contributorAccountSchema.shape,
  ...contributorConfirmationSchema.shape,
});

export type ContributorOnboardingFormData = z.infer<typeof contributorOnboardingSchema>;
