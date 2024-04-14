import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';
export const SetRole = (role: string) =>
  SetMetadata(ROLE_KEY, role);
