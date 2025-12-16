import { Injectable } from '@nestjs/common';

import { AuthPayload } from '@systems';
import { UserDTO, UserRepository } from '@domains';

import { HttpError } from '@infractract';
import { PaginationDTO } from '@shared';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getList(
    query: PaginationDTO.Request,
  ): Promise<{ users: UserDTO[]; pagination: PaginationDTO.Response }> {
    const { limit, page } = query;
    const { users, total_count } = await this.userRepository.getAll(query);

    const total_pages = Math.ceil(total_count / limit);
    const is_last_page = page >= total_pages;
    const items_count = users.length;

    const paginationResponse: PaginationDTO.Response = {
      page: page,
      total_pages: total_pages,
      items_count: items_count,
      is_last_page: is_last_page,
    };

    return {
      users: users.map(UserDTO.fromModel),
      pagination: paginationResponse,
    };
  }

  async findById(params: { userId: string }): Promise<{ user: UserDTO }> {
    const model = await this.userRepository.findById(params.userId);
    if (!model) {
      throw new HttpError({ status: 404, code: 'user_not_found' });
    }

    return { user: UserDTO.fromModel(model) };
  }

  async findAuthorized(auth: AuthPayload): Promise<{ user: UserDTO }> {
    const model = await this.userRepository.findById(auth.owner.id);

    if (!model) {
      throw new HttpError({ status: 404, code: 'user_not_found' });
    }

    return { user: UserDTO.fromModel(model) };
  }

  async updateById(
    params: { userId: string },
    body: UserDTO.Update,
  ): Promise<{ user: UserDTO }> {
    const model = await this.userRepository.update(params.userId, body);

    return { user: UserDTO.fromModel(model) };
  }

  async updateAuthorized(
    auth: AuthPayload,
    body: UserDTO.Update,
  ): Promise<{ user: UserDTO }> {
    const model = await this.userRepository.update(auth.owner.id, body);
    return { user: UserDTO.fromModel(model) };
  }
}
