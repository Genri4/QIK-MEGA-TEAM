import { PaginationDTO } from '@shared';
import { ChatsDTO, ChatsRepository } from '@domains';
import { AuthPayload } from '@systems';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async getAllByUser(
    query: PaginationDTO.Request,
    authPayload: AuthPayload,
  ): Promise<{ chats: ChatsDTO[]; pagination: PaginationDTO.Response }> {
    const { limit, page } = query;
    const { chats, total_count } = await this.chatsRepository.getAllByUser(
      authPayload.owner.id,
      query,
    );

    const total_pages = Math.ceil(total_count / limit);
    const is_last_page = page >= total_pages;
    const items_count = chats.length;

    const paginationResponse: PaginationDTO.Response = {
      page: page,
      total_pages: total_pages,
      items_count: items_count,
      is_last_page: is_last_page,
    };

    return {
      chats: chats,
      pagination: paginationResponse,
    };
  }

  async findById(params: { id: string }): Promise<{ chat: ChatsDTO } | null> {
    const model = await this.chatsRepository.findById(params.id);
    return { chat: ChatsDTO.fromModel(model) };
  }

  async create(
    body: ChatsDTO.Create,
    authPayload: AuthPayload,
  ): Promise<{ chat: ChatsDTO }> {
    const model = await this.chatsRepository.create(authPayload.owner.id, body);
    return { chat: ChatsDTO.fromModel(model) };
  }

  async update(
    params: { id: string },
    body: ChatsDTO.Update,
  ): Promise<{ chat: ChatsDTO }> {
    const model = await this.chatsRepository.update(params.id, body);
    return { chat: ChatsDTO.fromModel(model) };
  }

  async delete(params: { id: string }): Promise<{ deleted: boolean }> {
    const model = await this.chatsRepository.delete(params.id);
    return { deleted: model };
  }
}
