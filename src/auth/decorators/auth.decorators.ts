import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { SetRole } from './set-role.decorator';

export function Auth(role: string) {
  return applyDecorators(SetRole(role), UseGuards(AuthGuard, RoleGuard));
}
