import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chats, Messages, User, UserAuthMethod } from '@domains';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, UserAuthMethod, Chats, Messages])],
  exports: [TypeOrmModule],
})
export class TypeormModule {}
