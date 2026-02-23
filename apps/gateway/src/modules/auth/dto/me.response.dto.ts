export interface MeResponse {
  id: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  username?: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  roles?: string[];
  permissions?: string[];
  profile?: {
    avatar?: string | null;
    locale?: string | null;
    preferences?: any | null;
  } | null;
  session?: {
    sessionId?: string;
    tokenExpiresAt?: string;
  } | null;
}
