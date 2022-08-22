import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { TokenService } from './token/token.service';
import { AuthCacheService } from './auth-cache.service';
import { LoginDto } from './dto/login.dto';
import { AUTH_VALIDATION_ERRORS } from './auth.constants';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { getRandomNumberCode } from './utils/randomNumber';
import { MailService } from '../core/mail/mail.service';
import { jwtTokensInterface } from './interfaces/tokens.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly mailService: MailService,
  ) {}

  public async registration(registrationDto: RegistrationDto, userAgent: string): Promise<UserEntity> {
    const user = await this.usersService.createUser(registrationDto);
    const tokens = await this.tokenService.composeTokens(user.id);

    await this.tokenService.saveUserTokens(user, tokens, userAgent);

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
    await this.tokenService.saveUserTokens(user, tokens, userAgent);

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

  public async forgotPassword(mail: string): Promise<void | string> {
    const user = await this.usersService.findUserByMail(mail);

    if (!user) {
      throw new UnauthorizedException(AUTH_VALIDATION_ERRORS.USER_NOT_FOUND);
    }

    const randomCode = getRandomNumberCode();

    await Promise.all([
      this.mailService.sendVerificationMail(mail, randomCode),
      this.authCacheService.saveCodeToRedis(mail, randomCode),
    ]);
  }

  public async reviewCode(forgotPasswordDto: ForgotPasswordDto, userAgent: string): Promise<jwtTokensInterface> {
    const { mail, code } = forgotPasswordDto;

    const user = await this.usersService.findUserByMail(mail);

    const verifyCode = await this.authCacheService.isCodeExist(mail, code);
    if (!verifyCode) {
      throw new BadRequestException(AUTH_VALIDATION_ERRORS.CODE_INCORRECT);
    }

    const [tokens] = await Promise.all([
      this.tokenService.composeTokens(user.id),
      this.authCacheService.removeCodeFromRedis(mail, code),
    ]);

    await this.tokenService.saveUserTokens(user, tokens, userAgent);

    return tokens;
  }
}
