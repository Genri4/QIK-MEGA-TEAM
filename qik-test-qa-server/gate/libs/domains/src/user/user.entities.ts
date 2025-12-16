import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Chats } from '../chats';
import { UserAuthMethod } from '../user-auth-method';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  gitHubId: string;

  @Column({
    type: 'enum',
    enum: Theme,
    default: Theme.LIGHT,
  })
  theme: Theme;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({
    name: 'last_sent_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  lastSentAt: Date;

  @OneToMany(() => Chats, (chat) => chat.user)
  chats: Chats[];

  @OneToMany(() => UserAuthMethod, (authMethod) => authMethod.user)
  authMethods: UserAuthMethod[];
}
