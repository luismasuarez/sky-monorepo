import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from './action.enum';
import { Permission } from './permission.enum';

export type Subjects = 'Profile' | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;

const permissionRules: Record<Permission, { action: Action; subject: Subjects }> = {
  [Permission.AuthMeRead]: { action: Action.Read, subject: 'Profile' },
};

interface AbilityUser {
  permissions?: string[];
}

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: AbilityUser): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    const permissions = Array.isArray(user.permissions) ? user.permissions : [];

    permissions.forEach((permission) => {
      const rule = permissionRules[permission as Permission];
      if (rule) {
        can(rule.action, rule.subject);
      }
    });

    return build();
  }
}
