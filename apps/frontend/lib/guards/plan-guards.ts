import { AccountType, PlanType } from '@/app/auth/types';

export interface PlanLimits {
  maxWorkspaces: number | 'UNLIMITED';
  maxMembers: number | 'UNLIMITED';
  maxTeams: number | 'UNLIMITED';
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  FREE: {
    maxWorkspaces: 1,
    maxMembers: 1,
    maxTeams: 0,
  },
  PRO: {
    maxWorkspaces: 3,
    maxMembers: 5,
    maxTeams: 3,
  },
  TEAM: {
    maxWorkspaces: 10,
    maxMembers: 20,
    maxTeams: 10,
  },
  ENTERPRISE: {
    maxWorkspaces: 'UNLIMITED',
    maxMembers: 'UNLIMITED',
    maxTeams: 'UNLIMITED',
  },
};

export function canCreateWorkspace({
  plan,
  currentWorkspaceCount,
}: {
  plan: PlanType;
  currentWorkspaceCount: number;
}): boolean {
  const limits = PLAN_LIMITS[plan];
  if (limits.maxWorkspaces === 'UNLIMITED') return true;
  return currentWorkspaceCount < limits.maxWorkspaces;
}

export function canCreateTeam({
  accountType,
  plan,
  workspaceOwnerType,
  currentTeamCount,
}: {
  accountType: AccountType;
  plan: PlanType;
  workspaceOwnerType: 'ORGANIZATION' | 'USER';
  currentTeamCount: number;
}): boolean {
  if (accountType === 'FREELANCER') return false;
  if (workspaceOwnerType !== 'ORGANIZATION') return false;
  const limits = PLAN_LIMITS[plan];
  if (limits.maxTeams === 'UNLIMITED') return true;
  return currentTeamCount < limits.maxTeams;
}

export function canInviteUser({
  accountType,
  plan,
  currentMemberCount,
}: {
  accountType: AccountType;
  plan: PlanType;
  currentMemberCount: number;
}): boolean {
  if (accountType === 'FREELANCER') return false;
  const limits = PLAN_LIMITS[plan];
  if (limits.maxMembers === 'UNLIMITED') return true;
  return currentMemberCount < limits.maxMembers;
}
