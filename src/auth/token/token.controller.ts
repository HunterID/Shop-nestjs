import { Body, Controller, Put } from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateTokenDto } from './dto/token.dto';

@ApiTags('auth')
@Controller('auth/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @ApiOperation({ summary: 'Update access token' })
  @Put('update-access')
  public async updateAccessToken(@Body() accessUpdateTokenDto: UpdateTokenDto): Promise<{
    accessToken: string;
  }> {
    return this.tokenService.updateAccessToken(accessUpdateTokenDto.refreshToken);
  }

  @ApiOperation({ summary: 'Update refresh token' })
  @Put('update-refresh')
  public async updateRefreshToken(
    @Body() refreshUpdateTokenDto: UpdateTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.tokenService.updateRefreshToken(refreshUpdateTokenDto.refreshToken);
  }
}
