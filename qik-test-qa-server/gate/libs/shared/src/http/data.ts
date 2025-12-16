import { Constructable, Nullable } from '@shared';
import { JWTGuardOptions } from '@systems';

export namespace Data {
  export enum Method {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE',
    Patch = 'PATCH',
  }
  export type Path = Nullable<string[] | string>;

  export interface MethodContract {
    method: Method;
    path: Path;
    version?: string;
    name?: string;
    jwt?: JWTGuardOptions;
    description?: string;
    RequestQuery?: Constructable;
    RequestBody?: Constructable;
    RequestParams?: Constructable;
    ResponseBody: Constructable;
  }

  export interface ControllerContract {
    name: string;
    path: Path;
  }
}
