import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';

import { Theme, User } from '@domains';
import { ApiSchemaName, IdField } from '@shared';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

@ApiSchemaName('UserDTO')
export class UserDTO {
  @IdField()
  id: string;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  email: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  gitHubId?: string;
  @ApiProperty()
  @IsEnum(() => Theme)
  theme: Theme;
  @ApiProperty()
  @IsDate()
  createdAt: Date;
  @ApiProperty()
  @IsDate()
  lastSentAt: Date;

  static fromModel(model: User): UserDTO {
    return {
      id: model.id,
      name: model.name,
      email: model.email,
      gitHubId: model.gitHubId,
      theme: model.theme,
      createdAt: model.createdAt,
      lastSentAt: model.lastSentAt,
    };
  }
}

export namespace UserDTO {
  @ApiSchemaName('UserUpdateDTO')
  export class Update extends PartialType(
    OmitType(UserDTO, ['id', 'createdAt']),
  ) {}
  @ApiSchemaName('UserRegisterDTO')
  export class Register extends PickType(UserDTO, ['name', 'email']) {
    @ApiProperty()
    @IsString()
    password: string;
  }

  @ApiSchemaName('UserLoginDTO')
  export class Login extends PickType(UserDTO, ['email']) {
    @ApiProperty()
    @IsString()
    password: string;
  }
}
