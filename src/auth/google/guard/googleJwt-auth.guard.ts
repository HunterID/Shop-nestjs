import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Auth, google } from 'googleapis';
import { UserGoogleEntity } from '../entity/googleUser.entity';
import { GOOGLE_CLIENT } from '../google.constants';

@Injectable()
export class GoogleJwtAuthGuard implements CanActivate {
  constructor(@Inject(GOOGLE_CLIENT) private readonly googleClient: Auth.OAuth2Client) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const accessToken = authHeader.split(' ')[1];

      const userInfoClient = google.oauth2('v2').userinfo;

      this.googleClient.setCredentials({
        access_token: accessToken,
      });

      const { data } = await userInfoClient.get({
        auth: this.googleClient,
      });

      const googleUser = plainToInstance(UserGoogleEntity, data);

      request.googleUser = { googleUser };

      return true;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException();
    }
  }
}
