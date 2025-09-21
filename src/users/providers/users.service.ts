/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PatchUserDto } from '../dtos/patch-user-dto';

import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
import { UserCreateManyProvider } from './user-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';

/**
 * Class to connect to users table and perform business operations
 */

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly usersCreateManyProvider: UserCreateManyProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,
  ) {}

  /**
   * To create user from the database
   */
  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   * To get all the user from the databse
   */
  public findAll(limit: number, page: number) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint dose not exists',
        fileName: 'users.service.ts',
        lineNumber: 83,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured beacuse the API endpoint was permanebtly moved',
      },
    );
  }

  /**
   * To single user from the databse
   */
  public findOneByIds(id: string) {
    return {
      firstName: 'John',
      email: 'john@gmail.com',
    };
  }

  /**
   * To update user from the databse
   */
  public updateUsers(updateUserDto: PatchUserDto) {
    return updateUserDto;
  }
  public async findOneById(id: number) {
    let user: User | null = null;
    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    if (!user) {
      throw new BadRequestException('The user id is not found ', {});
    }
    return user;
  }

  public async createMany(createManyUserDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUserDto);
  }

  public async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }

  public async findOneByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }
}
