import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/decorator/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { fileInterface } from './interface/file.interface';
import { SWAGGER_UPLOAD_SUMMARY } from './multer.constants';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class MulterController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: SWAGGER_UPLOAD_SUMMARY.UPLOAD_AVATAR })
  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('image'))
  public async uploadImage(@UploadedFile() file: fileInterface, @User('userId') userId: string): Promise<UserEntity> {
    return this.userService.saveUserAvatar(file.location, userId);
  }
}
