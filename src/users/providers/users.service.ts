import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PatchUserDto } from '../dtos/patch-user-dto';

import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Class to connect to users table and perform business operations
 */

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * To create user from the database
   */
  public async createUsers(createUserDto: CreateUserDto) {
    // Check is user already exsists with same email
    const exsistingUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    // Handle exception
    //Create a new user
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }

  /**
   * To get all the user from the databse
   */
  public findAll(limit: number, page: number) {
    return [
      {
        firstName: 'John',
        email: 'john@gmail.com',
      },
      {
        firstName: 'John2',
        email: 'john2@gmail.com',
      },
    ];
  }

  /**
   * To single user from the databse
   */
  public findOneById(id: string) {
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
}
