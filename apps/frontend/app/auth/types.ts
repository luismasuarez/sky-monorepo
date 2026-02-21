// Tipos de usuario y autenticación para Auth.js v5

// Roles de usuario globales (no confundir con roles de membresía en organizaciones)
export type UserRole = 'freelancer' | 'developer' | 'qa' | 'designer' | 'manager' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginResponse {
  success: boolean;
  data: AuthResponse;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
  };
  message?: string;
}

// Multi-tenant onboarding types

// Tipos de cuenta para onboarding multi-tenant
export enum AccountType {
  ORGANIZATION = 'ORGANIZATION',
  FREELANCER = 'FREELANCER',
}

// Tipos de planes
export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  TEAM = 'TEAM',
  ENTERPRISE = 'ENTERPRISE',
}

// Roles de membresía en organizaciones/workspaces
export enum MembershipRole {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
}

// Tipo de propietario de workspace
export enum OwnerType {
  ORGANIZATION = 'ORGANIZATION',
  USER = 'USER',
}

// Payload genérico para registro inicial

export type RegisterPayload = {
  accountType: AccountType;
  name: string; // nombre de organización o nombre personal
  email: string;
  password: string;
};

export interface ApiError {
  message: string;
  statusCode: number;
  errorCode?: string;
  details?: unknown;
}
