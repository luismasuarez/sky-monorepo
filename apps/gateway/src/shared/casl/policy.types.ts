import { AppAbility } from './casl-ability.factory';

export interface PolicyHandler {
  handle(ability: AppAbility): boolean;
}

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandlerLike = PolicyHandler | PolicyHandlerCallback;
