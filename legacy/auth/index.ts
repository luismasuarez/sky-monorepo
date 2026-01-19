export { AccountTypeSelection } from './components/account-type-selection';
export { AuthLayout } from './components/auth-layout';
export { LoginForm } from './components/login-form';
export { OnboardingFlow } from './components/onboarding-flow';
export { OnboardingStepper } from './components/onboarding-stepper';
export { RegisterForm } from './components/register-form';
export { StepIndicator } from './components/step-indicator';

// Services
export { authService, userService } from './services';
export { localAuthService } from './services/localAuthService';
export { onboardingService } from './services/onboardingService';

// Hooks
export {
  useAuth, useAuthStatus, useCurrentUser,
  useUpdateCurrentUser
} from './hooks/useAuth';
export { useOnboardingStepper } from './hooks/useOnboardingStepper';

// Types
export type {
  ApiError, AuthResponse, GetUserResponse, LoginRequest, LoginResponse, MutationOptions,
  QueryOptions, RegisterRequest, RegisterResponse,
  UpdateUserRequest, UpdateUserResponse, User,
  UserRole
} from './types/authTypes';

export type {
  AccountType, ContributorOnboardingData, OnboardingResult, Organization, OwnerOnboardingData, Workspace, WorkspaceMembership
} from './types/onboardingTypes';

export type {
  ContributorOnboardingFormData, OwnerOnboardingFormData
} from './schemas/onboarding.schema';

export { contributorSteps, ownerSteps } from './config/onboarding-steps.config';
export type { StepConfig } from './config/onboarding-steps.config';

