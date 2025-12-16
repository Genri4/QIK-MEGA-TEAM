import type { Union } from '@shared';

export namespace Data {
  export type Scope = Union<Scope.Enum>;
  export namespace Scope {
    export enum Enum {
      Database = 'database',
      JWT = 'jwt',
      NATS = 'nats',
    }
  }

  export type Service = Union<Service.Enum>;
  export namespace Service {
    export enum Enum {
      Gate = 'gate',
    }
  }
}
