import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './decorator/user.decorator';
import { UserEntity } from './entity/user.entity';
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

  @ApiOperation({ summary: '' })
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  public async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return null;
  }
}
