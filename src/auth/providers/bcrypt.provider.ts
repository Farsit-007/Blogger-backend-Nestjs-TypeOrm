import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string): Promise<string> {
    // Generate Salt
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  comparePassword(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
