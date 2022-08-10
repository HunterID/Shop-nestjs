import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { UserToRole } from './models/userRole.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserToRole])],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
