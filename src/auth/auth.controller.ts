import { Body, Controller, Post, UseGuards, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/decorator/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { SWAGGER_AUTH_SUMMARY } from './auth.constants';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RegistrationDto } from './dto/registration.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MailUniqueGuard } from './guards/mail-unique.guard';
import { jwtTokensInterface } from './interfaces/tokens.interfaces';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: SWAGGER_AUTH_SUMMARY.REGISTRATION })
  @ApiCreatedResponse({
    type: UserEntity,
  })
  @ApiBody({ type: [RegistrationDto] })
  @UseGuards(MailUniqueGuard)
  @Post('registration')
  public async registration(@Body() registrationDto: RegistrationDto, @Headers() headers: string): Promise<UserEntity> {
    return this.authService.registration(registrationDto, headers['user-agent']);
  }

  @ApiOperation({ summary: SWAGGER_AUTH_SUMMARY.LOGIN })
  @ApiBody({ type: [LoginDto] })
  @ApiCreatedResponse({
    type: UserEntity,
  })
  @Post('login')
  public async login(@Body() loginDto: LoginDto, @Headers() headers: string): Promise<UserEntity> {
    return this.authService.login(loginDto, headers['user-agent']);
  }

  @ApiOperation({ summary: SWAGGER_AUTH_SUMMARY.LOGOUT })
  @ApiBody({ type: [LogoutDto] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  public async logout(
    @Body() logoutDto: LogoutDto,
    @User('userId', 'accessToken') userId: string,
    accessToken: string,
  ): Promise<void> {
    return this.authService.logout(userId, accessToken, logoutDto.refreshToken);
  }

  @ApiOperation({ summary: SWAGGER_AUTH_SUMMARY.FORGOT_PASSWORD })
  @ApiBody({ type: [ForgotPasswordDto] })
  @Post('/forgotPassword')
  public async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void | string> {
    await this.authService.forgotPassword(forgotPasswordDto.mail);
  }

  @ApiOperation({ summary: SWAGGER_AUTH_SUMMARY.REVIEW_CODE })
  @ApiBody({ type: [ForgotPasswordDto] })
  @Post('/reviewCode')
  public async reviewCode(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Headers() headers: string,
  ): Promise<jwtTokensInterface> {
    return this.authService.reviewCode(forgotPasswordDto, headers['user-agent']);
  }
}
