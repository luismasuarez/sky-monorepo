import { SetMetadata } from '@nestjs/common';
import { PolicyHandlerLike } from '../casl/policy.types';

export const CHECK_POLICIES_KEY = 'check_policy';

export const CheckPolicies = (...handlers: PolicyHandlerLike[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
