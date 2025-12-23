

import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetCurrrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();

    const id = request.user?.userId; // <-- FIX HERE

    if (!id) throw new UnauthorizedException('Missing userId on request.user');
    return Number(id);
  },
);
