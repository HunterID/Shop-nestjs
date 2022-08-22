import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { AUTH_VALIDATION_ERRORS } from '../auth.constants';

@Injectable()
export class MailUniqueGuard implements CanActivate {
  constructor(private readonly usersService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { mail } = request.body;

    await this.isUserExistInSystem(mail);

    return true;
  }

  private async isUserExistInSystem(mail: string): Promise<void> {
    const user = await this.usersService.findUserByMail(mail);

    if (user) {
      throw new BadRequestException(AUTH_VALIDATION_ERRORS.MAIL_ALREADY_EXISTS);
    }
  }
}
