import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

import { Chats } from '@domains';
import { ApiSchemaName, IdField } from '@shared';
import { IsDate, IsString } from 'class-validator';

@ApiSchemaName('ChatsDTO')
export class ChatsDTO {
  @IdField()
  id: string;
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsDate()
  createdAt: Date;

  static fromModel(model: Chats): ChatsDTO {
    return {
      id: model.id,
      title: model.title,
      createdAt: model.createdAt,
    };
  }
}

export namespace ChatsDTO {
  @ApiSchemaName('ChatsCreateDTO')
  export class Create extends OmitType(ChatsDTO, ['id', 'createdAt']) {}
  @ApiSchemaName('ChatsUpdateDTO')
  export class Update extends PartialType(ChatsDTO.Create) {}
}
