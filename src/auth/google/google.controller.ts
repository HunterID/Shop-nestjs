import { Controller, Post, UseGuards, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { GoogleUser } from './decorator/google.decorator';
import { UserGoogleEntity } from './entity/googleUser.entity';
import { SWAGGER_GOOGLE_AUTH_SUMMARY } from './google.constants';
import { GoogleAuthService } from './google.service';
import { GoogleJwtAuthGuard } from './guard/googleJwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @ApiOperation({ summary: SWAGGER_GOOGLE_AUTH_SUMMARY.GOOGLE_LOGIN })
  @ApiCreatedResponse({
    type: UserEntity,
  })
  @ApiBearerAuth()
  @UseGuards(GoogleJwtAuthGuard)
  @Post('google/login')
  public async googleAuth(
    @GoogleUser('googleUser') userGoogleEntity: UserGoogleEntity,
    @Headers() headers: string,
  ): Promise<UserEntity> {
    return this.googleAuthService.signInWithGoogle(userGoogleEntity, headers['user-agent']);
  }
}
