import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './decorator/user.decorator';
import { ChangePasswordDto } from './dto/changePassword.dto';
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
  @ApiCreatedResponse({ type: UserEntity })
  @Get('profile')
  public async getUserProfile(@User('userId') userId: string): Promise<UserEntity> {
    return this.usersService.findUserById(userId);
  }

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.RESET_PASSWORD })
  @ApiCreatedResponse({ type: UserEntity })
  @ApiBody({ type: [ChangePasswordDto] })
  @Post('resetPassword')
  public async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @User('userId') userId: string,
  ): Promise<UserEntity> {
    return this.usersService.changePassword(changePasswordDto.password, userId);
  }
}
