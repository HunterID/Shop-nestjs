import { Body, Controller, Post, UseGuards, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/decorator/user.decorator';
import { UserEntity } from '../user/entity/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RegistrationDto } from './dto/registration.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MailUniqueGuard } from './guards/mail-unique.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'registration' })
  @UseGuards(MailUniqueGuard)
  @Post('registration')
  public async registration(@Body() registrationDto: RegistrationDto, @Headers() headers: string): Promise<UserEntity> {
    return this.authService.registration(registrationDto, headers['user-agent']);
  }

  @ApiOperation({ summary: 'login' })
  @Post('login')
  public async login(@Body() loginDto: LoginDto, @Headers() headers: string): Promise<UserEntity> {
    return this.authService.login(loginDto, headers['user-agent']);
  }

  @ApiOperation({ summary: 'logout' })
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
}
