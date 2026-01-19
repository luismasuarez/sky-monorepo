/**
 * Account types for onboarding flow
 * @deprecated Roles are now contextual via WorkspaceMembers, not global user properties
 */
export type AccountType = 'owner' | 'contributor';

/**
 * Owner onboarding data (Organization account)
 */
export interface OwnerOnboardingData {
  // User data
  email: string;
  password: string;

  // Organization data
  organizationName: string;

  // Initial workspace
  workspaceName: string;

  // Optional contact info
  contactName?: string;
  phone?: string;
}

/**
 * Contributor onboarding data (Freelancer account)
 */
export interface ContributorOnboardingData {
  // User data
  email: string;
  password: string;

  // Personal info
  name: string;

  // Optional workspace name (defaults to "Personal")
  workspaceName?: string;
}

/**
 * Workspace entity
 * Updated: Uses ownerUserId for personal workspaces instead of userId
 */
export interface Workspace {
  id: string;
  // Exactly one of these should be set
  organizationId?: string; // For organization workspaces
  ownerUserId?: string;    // For personal workspaces (formerly userId)
  // Legacy field for compatibility
  userId?: string;         // @deprecated Use ownerUserId instead
  name: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Organization entity (tenant for Owner accounts)
 */
export interface Organization {
  id: string;
  name: string;
  ownerId: string; // user who owns this organization
  contactEmail?: string;
  contactName?: string;
  phone?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Workspace membership (user-workspace relationship)
 */
export interface WorkspaceMembership {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'contributor';
  status: 'active' | 'invited' | 'revoked';
  createdAt: number;
  updatedAt: number;
}

/**
 * Local user entity for IndexedDB storage
 * Updated: accountType removed - roles are contextual via WorkspaceMembers
 */
export interface LocalUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  // Legacy fields for compatibility
  accountType?: AccountType;      // @deprecated Use WorkspaceMembers for roles
  defaultWorkspaceId?: string;    // @deprecated Use session management
  organizationId?: string;        // @deprecated Get from workspaces
  createdAt: number;
  updatedAt: number;
}

/**
 * Complete onboarding result
 * Updated: No accountType in user, organization is optional
 */
export interface OnboardingResult {
  user: {
    id: string;
    email: string;
    // Legacy field for compatibility
    accountType?: AccountType;  // @deprecated
  };
  workspace: Workspace;
  organization?: Organization;
  membership: WorkspaceMembership;
}
