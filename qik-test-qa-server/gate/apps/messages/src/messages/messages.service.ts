import { MessagesDTO, MessagesRepository, SenderType } from '@domains';
import { PaginationDTO } from '@shared';

import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async getAllByChats(
    query: PaginationDTO.Request,
    params: { chatId: string },
  ): Promise<{ messages: MessagesDTO[]; pagination: PaginationDTO.Response }> {
    const { chatId } = params;
    const { limit, page } = query;
    const { messages, total_count } =
      await this.messagesRepository.getAllByChats(chatId, query);

    const total_pages = Math.ceil(total_count / limit);
    const is_last_page = page >= total_pages;
    const items_count = messages.length;

    const paginationResponse: PaginationDTO.Response = {
      page: page,
      total_pages: total_pages,
      items_count: items_count,
      is_last_page: is_last_page,
    };

    return {
      messages: messages,
      pagination: paginationResponse,
    };
  }

  async getAllByChatsAndSender(
    query: PaginationDTO.Request & { sender: SenderType },
    params: { chatId: string },
  ): Promise<{ messages: MessagesDTO[]; pagination: PaginationDTO.Response }> {
    const { chatId } = params;
    const { limit, page, sender } = query;
    const { messages, total_count } =
      await this.messagesRepository.getAllByChatsAndSender(chatId, sender, {
        limit,
        page,
      });

    const total_pages = Math.ceil(total_count / limit);
    const is_last_page = page >= total_pages;
    const items_count = messages.length;

    const paginationResponse: PaginationDTO.Response = {
      page: page,
      total_pages: total_pages,
      items_count: items_count,
      is_last_page: is_last_page,
    };

    return {
      messages: messages,
      pagination: paginationResponse,
    };
  }

  async findById(params: {
    id: string;
  }): Promise<{ message: MessagesDTO } | null> {
    const model = await this.messagesRepository.findById(params.id);
    return { message: MessagesDTO.fromModel(model) };
  }

  async create(
    params: { chatId: string },
    body: MessagesDTO.Create,
  ): Promise<{ message: MessagesDTO }> {
    const model = await this.messagesRepository.create(params.chatId, body);
    return { message: MessagesDTO.fromModel(model) };
  }

  async update(
    params: { id: string },
    body: MessagesDTO.Update,
  ): Promise<{ message: MessagesDTO }> {
    const model = await this.messagesRepository.update(params.id, body);
    return { message: MessagesDTO.fromModel(model) };
  }

  async delete(params: { id: string }): Promise<{ deleted: boolean }> {
    const model = await this.messagesRepository.delete(params.id);
    return { deleted: model };
  }
}
