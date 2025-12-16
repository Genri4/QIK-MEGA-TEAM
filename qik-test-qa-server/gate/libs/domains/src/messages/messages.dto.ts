import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

import { Messages, SenderType } from './messages.entities';
import { ApiSchemaName, IdField } from '@shared';
import { IsDate, IsEnum, IsString } from 'class-validator';

@ApiSchemaName('MessagesDTO')
export class MessagesDTO {
  @IdField()
  id: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ enum: SenderType })
  @IsEnum(SenderType)
  sender: SenderType;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  static fromModel(model: Messages): MessagesDTO {
    return {
      id: model.id,
      content: model.content,
      sender: model.sender,
      createdAt: model.createdAt,
    };
  }
}

export namespace MessagesDTO {
  @ApiSchemaName('MessagesCreateDTO')
  export class Create extends OmitType(MessagesDTO, ['id', 'createdAt']) {}
  @ApiSchemaName('MessagesUpdateDTO')
  export class Update extends PartialType(MessagesDTO.Create) {}
}
