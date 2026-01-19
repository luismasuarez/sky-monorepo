// User role enum
export type UserRole = 'freelancer' | 'developer' | 'qa' | 'designer' | 'manager' | 'admin';

// User interface
export interface User {
  id: string;
  email: string;
  role: UserRole;
}

// Authentication interfaces
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

// User management interfaces
export interface UpdateUserRequest {
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface GetUserResponse {
  success: boolean;
  data: User;
}

export interface UpdateUserResponse {
  success: boolean;
  data: User;
}

// Error interfaces
export interface ApiError {
  message: string;
  statusCode: number;
  errorCode: string;
  details?: any;
}

// React Query mutation options
export interface MutationOptions<TData = any, _TVariables = any> {
  onSuccess?: (data: TData) => void;
  onError?: (error: ApiError) => void;
  onSettled?: () => void;
}

// React Query query options
export interface QueryOptions<_TData = any> {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  staleTime?: number;
  cacheTime?: number;
}