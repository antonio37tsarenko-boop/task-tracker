import { createParamDecorator } from '@nestjs/common';
import { IJwtPayload } from '../common/interfaces/jwt-payload.interface';

export const User = createParamDecorator((data: unknown, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as IJwtPayload;
});
