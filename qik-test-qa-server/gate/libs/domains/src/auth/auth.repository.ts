import { DataSource, Repository } from 'typeorm';
import { User, UserDTO } from '../user';
import { UserAuthMethod, UserAuthType } from '../user-auth-method';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  private userRepository: Repository<User>;
  private authMethodRepository: Repository<UserAuthMethod>;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
    this.authMethodRepository = this.dataSource.getRepository(UserAuthMethod);
  }

  async login(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['authMethods'],
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async register(body: UserDTO.Register): Promise<User | null> {
    const existingUser = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (existingUser) {
      return null;
    }

    const newUser = this.userRepository.create({
      ...body,
    });

    return await this.userRepository.save(newUser);
  }

  async createAuthMethod(
    userId: string,
    hashedPassword: string,
  ): Promise<void> {
    const authMethod = this.authMethodRepository.create({
      type: UserAuthType.PASSWORD,
      reference: hashedPassword,
      userId,
    });
    await this.authMethodRepository.save(authMethod);
  }
}
