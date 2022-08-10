import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/models/user.model';
import { TokenService } from './token/token.service';
import { jwtTokensInterface } from './interfaces/tokens.interfaces';
import { AuthCacheService } from './auth-cache.service';
import { LoginDto } from './dto/login.dto';
import { AUTH_VALIDATION_ERRORS } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
  ) {}

  public async registration(registrationDto: RegistrationDto, userAgent: string): Promise<UserEntity> {
    const user = await this.usersService.createUser(registrationDto);
    const tokens = await this.tokenService.composeTokens(user.id);

    await this.saveUserTokens(user, tokens, userAgent);

    return this.usersService.composeUserEntity({ ...user, ...tokens });
  }

  public async login(loginDto: LoginDto, userAgent: string): Promise<UserEntity> {
    const { mail, password } = loginDto;

    const user = await this.usersService.findUserByMail(mail);
    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordDecryption = await this.usersService.isPasswordMatches(password, user.password);
    if (!passwordDecryption) {
      throw new BadRequestException(AUTH_VALIDATION_ERRORS.WRONG_CREDENTIALS_PROVIDED);
    }

    const tokens = await this.tokenService.composeTokens(user.id);
    await this.saveUserTokens(user, tokens, userAgent);

    return this.usersService.composeUserEntity({ ...user, ...tokens });
  }

  public async logout(userId: string, accessToken: string, refreshToken: string): Promise<void> {
    try {
      await Promise.all([
        this.tokenService.removeRefreshToken(refreshToken),
        this.authCacheService.removeAccessTokenFromRedis(userId, accessToken),
      ]);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async saveUserTokens(user: User, tokens: jwtTokensInterface, userAgent: string): Promise<void> {
    const { accessToken, refreshToken } = tokens;

    await Promise.all([
      this.tokenService.saveRefreshToken(refreshToken, user, userAgent),
      this.authCacheService.saveAccessTokenToRedis(user.id, accessToken),
    ]);
  }
}
