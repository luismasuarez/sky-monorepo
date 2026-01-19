// Tipos de usuario y autenticación para Auth.js v5

export type UserRole = "freelancer" | "developer" | "qa" | "designer" | "manager" | "admin";

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
export enum AccountType {
  ORGANIZATION = "ORGANIZATION",
  FREELANCER = "FREELANCER",
}

export enum PlanType {
  FREE = "FREE",
  // Otros planes pueden agregarse aquí
}

export enum MembershipRole {
  OWNER = "OWNER",
  MEMBER = "MEMBER",
}

export type RegisterPayload = {
  accountType: AccountType;
  name: string;
  email: string;
  organizationName?: string;
  plan?: PlanType;
};

export interface ApiError {
  message: string;
  statusCode: number;
  errorCode?: string;
  details?: any;
}
