import { createParamDecorator } from '@nestjs/common';

const User = createParamDecorator((data: unknown, ctx) => {
  const request = ctx.switchToHttp().getRequest();
});
