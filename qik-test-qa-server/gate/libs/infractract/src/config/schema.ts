import { IsInt, IsString } from 'class-validator';
import { Data } from './data';
import { Type } from 'class-transformer';

export namespace Schema {
  export namespace Service {
    export class Gate {
      static service: Data.Service = Data.Service.Enum.Gate;

      @Type(() => Number)
      @IsInt()
      GATE_HTTP_PORT: number;
      @IsString()
      GATE_HTTP_ALLOWED_ORIGINS: string;
    }

    export const Self = [Gate];
  }

  export namespace Scope {
    export class Database {
      static scope: Data.Scope = Data.Scope.Enum.Database;

      @IsString()
      DATABASE_HOST: string;
      @Type(() => Number)
      @IsInt()
      DATABASE_UI_PORT: number;
      @Type(() => Number)
      @IsInt()
      DATABASE_PORT: number;
      @IsString()
      DATABASE_USER: string;
      @IsString()
      DATABASE_PASSWORD: string;
      @IsString()
      DATABASE_NAME: string;
    }

    export class JWT {
      static scope: Data.Scope = Data.Scope.Enum.JWT;

      @IsString()
      JWT_REFRESH_TOKEN_SECRET: string;
      @IsString()
      JWT_ACCESS_TOKEN_SECRET: string;
      @Type(() => Number)
      @IsInt()
      SALT_ROUNDS: number;
    }

    export class NATS {
      static scope: Data.Scope = Data.Scope.Enum.NATS;

      @IsString()
      NATS_PATH_LOCAL: string;
      @IsString()
      NATS_PATH_PROD: string;
    }

    export const Self = [Database, JWT, NATS];
  }
}
