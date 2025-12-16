import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../user';

export enum UserAuthType {
  YANDEX = 'yandex',
  VK = 'vk',
  PASSWORD = 'password',
}

@Entity('user_auth_methods')
@Unique(['user', 'type'])
export class UserAuthMethod {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserAuthType,
  })
  type: UserAuthType;

  @Column({ length: 255 })
  reference: string;

  @ManyToOne(() => User, (user) => user.authMethods, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;
}