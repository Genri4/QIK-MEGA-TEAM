import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ConfigSchema } from '@infractract/config';

@Injectable()
export class PasswordService {
  constructor(private config: ConfigService<ConfigSchema.Scope.JWT>) {}

  hashPassword = async (password: string): Promise<string> => {
    const saltRounds = this.config.get<number>('SALT_ROUNDS');
    return bcrypt.hash(password, saltRounds);
  };

  checkPassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  };
}
``