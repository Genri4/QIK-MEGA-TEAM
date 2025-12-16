import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Chats } from '../chats';

export enum SenderType {
  USER = 'user',
  SENDER = 'sender',
}

@Entity('messages')
export class Messages {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: SenderType,
    default: SenderType.USER,
  })
  sender: SenderType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @ManyToOne(() => Chats, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat: Chats;

  @Column({ type: 'uuid' })
  chatId: string;
}
