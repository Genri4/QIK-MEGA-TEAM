import { DataSource, Repository } from 'typeorm';
import { PaginationDTO } from '@shared';
import { Messages, SenderType } from './messages.entities';
import { MessagesDTO } from './messages.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesRepository {
  private messagesRepository: Repository<Messages>;

  constructor(private dataSource: DataSource) {
    this.messagesRepository = this.dataSource.getRepository(Messages);
  }

  async getAllByChats(
    chatId: string,
    query: PaginationDTO.Request,
  ): Promise<{ messages: Messages[]; total_count: number }> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [messages, total_count] = await this.messagesRepository.findAndCount({
      where: { chatId },
      take: limit,
      skip: skip,
      order: { createdAt: 'DESC' },
    });

    return {
      messages: messages,
      total_count,
    };
  }

  async getAllByChatsAndSender(
    chatId: string,
    sender: SenderType,
    query: PaginationDTO.Request,
  ): Promise<{ messages: Messages[]; total_count: number }> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [messages, total_count] = await this.messagesRepository.findAndCount({
      where: { chatId, sender },
      take: limit,
      skip: skip,
      order: { createdAt: 'DESC' },
    });

    return {
      messages: messages,
      total_count,
    };
  }

  async findById(id: string): Promise<Messages | null> {
    const messages = await this.messagesRepository.findOne({ where: { id } });
    if (!messages) {
      return null;
    }
    return messages;
  }

  async create(chatId: string, body: MessagesDTO.Create): Promise<Messages> {
    const newMessages = this.messagesRepository.create(body);
    newMessages.chatId = chatId;
    return this.messagesRepository.save(newMessages);
  }

  async update(id: string, body: MessagesDTO.Update): Promise<Messages> {
    const messages = await this.findById(id);
    const updatedMessages = Object.assign(messages, body);
    return this.messagesRepository.save(updatedMessages);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.messagesRepository.delete(id);

    return result.affected === 0 ? false : true;
  }
}
