import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { User } from './models/user.model';
import { PASSWORD_SALT_ROUNDS } from './user.constants';
import { RegistrationDto } from '../auth/dto/registration.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  public async createUser(registrationDto: RegistrationDto): Promise<User> {
    const { password } = registrationDto;
    const hashPassword = await this.hashedPassword(password);

    return this.usersRepository.save({ ...registrationDto, password: hashPassword });
  }

  public async findUserById(userId: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    return this.composeUserEntity(user);
  }

  public async findUserByMail(mail: string): Promise<User> {
    return this.usersRepository.findOneBy({ mail });
  }

  public async isPasswordMatches(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private async hashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  }

  public async composeUserEntity(user: Partial<UserEntity>): Promise<UserEntity> {
    return plainToInstance(UserEntity, user);
  }
}
