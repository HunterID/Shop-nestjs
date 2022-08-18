import { Auth, google } from 'googleapis';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GOOGLE_CLIENT } from './google.constants';

const googleFactory = async (configService: ConfigService): Promise<Auth.OAuth2Client> => {
  const { googleId, googleSecret } = configService.get('google');

  return new google.auth.OAuth2(googleId, googleSecret);
};

export const googleProvider: Provider = {
  useFactory: googleFactory,
  inject: [ConfigService],
  provide: GOOGLE_CLIENT,
};
