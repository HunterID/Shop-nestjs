import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { TokenService } from '../token/token.service';
import { UserGoogleEntity } from './entity/googleUser.entity';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly userService: UserService, private readonly tokenService: TokenService) {}

  public async signInWithGoogle(userGoogleEntity: UserGoogleEntity, userAgent: string): Promise<UserEntity> {
    const user = await this.userService.findUserByMail(userGoogleEntity.mail);
    if (!user) {
      return this.handleRegisteredUser(userGoogleEntity, userAgent);
    }
    const tokens = await this.tokenService.composeTokens(user.id);

    return this.userService.composeUserEntity({ ...user, ...tokens });
  }

  private async handleRegisteredUser(userGoogleEntity: UserGoogleEntity, userAgent: string): Promise<UserEntity> {
    const user = await this.userService.createGoogleUser(userGoogleEntity);
    const tokens = await this.tokenService.composeTokens(user.id);

    await this.tokenService.saveUserTokens(user, tokens, userAgent);

    return this.userService.composeUserEntity({ ...user, ...tokens });
  }
}
