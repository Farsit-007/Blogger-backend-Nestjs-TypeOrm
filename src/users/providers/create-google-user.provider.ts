import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { GoogleUserInterface } from '../interfaces/google-user-interface';

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async createGooglUser(googleUser: GoogleUserInterface) {
    try {
      const user = this.usersRepository.create(googleUser);
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Cloud not create a user',
      });
    }
  }
}
