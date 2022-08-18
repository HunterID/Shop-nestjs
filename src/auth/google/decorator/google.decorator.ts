import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GoogleUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const googleUser = request.googleUser;

  return data ? googleUser?.[data] : googleUser;
});
