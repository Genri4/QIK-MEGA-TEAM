import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { AuthPayload } from '@systems';
import { PaginationDTO } from '@shared';
import { UserDTO } from '@domains';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('users.getAll')
  async getAll(@Payload() data: { query: PaginationDTO.Request }) {
    return this.userService.getList(data.query);
  }

  @MessagePattern('users.findById')
  async findById(@Payload() data: { params: { userId: string } }) {
    return this.userService.findById(data.params);
  }

  @MessagePattern('users.findAuthorize')
  async findAuthorize(@Payload() data: { auth: AuthPayload }) {
    return this.userService.findAuthorized(data.auth);
  }

  @MessagePattern('users.updateById')
  async update(
    @Payload() data: { params: { userId: string }; body: UserDTO.Update },
  ) {
    return this.userService.updateById(data.params, data.body);
  }

  @MessagePattern('users.updateAuthorized')
  async updateAuthorize(
    @Payload() data: { auth: AuthPayload; body: UserDTO.Update },
  ) {
    return this.userService.updateAuthorized(data.auth, data.body);
  }
}
