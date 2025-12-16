import { DataSource, Repository } from 'typeorm';
import { ChatsDTO, Chats } from '@domains';
import { PaginationDTO } from '@shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatsRepository {
  private chatsRepository: Repository<Chats>;

  constructor(private dataSource: DataSource) {
    this.chatsRepository = this.dataSource.getRepository(Chats);
  }

  async getAllByUser(
    userId: string,
    query: PaginationDTO.Request,
  ): Promise<{ chats: Chats[]; total_count: number }> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [chats, total_count] = await this.chatsRepository.findAndCount({
      where: { userId },
      take: limit,
      skip: skip,
      order: { createdAt: 'DESC' },
    });

    return {
      chats: chats,
      total_count,
    };
  }

  async findById(id: string): Promise<Chats | null> {
    const chat = await this.chatsRepository.findOne({ where: { id } });
    if (!chat) {
      return null;
    }
    return chat;
  }

  async findByUser(userId: string): Promise<Chats> {
    return this.chatsRepository.findOne({ where: { userId } });
  }

  async create(userId: string, body: ChatsDTO.Create): Promise<Chats> {
    const newChat = this.chatsRepository.create(body);
    newChat.userId = userId;

    return this.chatsRepository.save(newChat);
  }

  async update(id: string, body: ChatsDTO.Update): Promise<Chats> {
    const chat = await this.findById(id);
    const updatedChat = Object.assign(chat, body);
    return this.chatsRepository.save(updatedChat);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.chatsRepository.delete(id);

    return result.affected === 0 ? false : true;
  }
}
