import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './decorator/user.decorator';
import { UserEntity } from './entities/user.entity';
import { SWAGGER_USER_SUMMARY } from './user.constants';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.PROFILE })
  @Get('profile')
  public async getUserProfile(@User('userId') userId: string): Promise<UserEntity> {
    return this.usersService.findUserById(userId);
  }
}
