import { CanActivate, ExecutionContext, Global, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCacheService } from '../auth-cache.service';
import { AUTH_VALIDATION_ERRORS } from '../auth.constants';
import { TokenService } from '../token/token.service';

@Global()
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private authCacheService: AuthCacheService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const accessToken = authHeader.split(' ')[1];

      const { userId } = await this.tokenService.verifyToken(accessToken);

      await this.authCacheService.isAccessTokenExist(userId, accessToken);

      request.user = { accessToken, userId };

      return true;
    } catch (error) {
      throw new UnauthorizedException(AUTH_VALIDATION_ERRORS.AUTHORIZATION_ERROR);
    }
  }
}
