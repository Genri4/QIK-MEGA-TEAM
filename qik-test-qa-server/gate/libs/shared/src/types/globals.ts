import { Union } from '@shared';

export type Environment = Union<Environment.Enum>;
export namespace Environment {
  export enum Enum {
    Local = 'local',
    Dev = 'dev',
    Prod = 'prod',
  }
}

export type UpdateUserType = 'favorite' | 'order' | 'clientData';
