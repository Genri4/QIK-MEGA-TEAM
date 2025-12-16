import { Delete, Get, Patch, Post, Put } from '@nestjs/common';

import { Data } from './data';

export class Utility {
  static formMethodDecorator = (method: Data.Method, path: Data.Path) => {
    switch (method) {
      case Data.Method.Get:
        return Get(path);
      case Data.Method.Put:
        return Put(path);
      case Data.Method.Patch:
        return Patch(path);
      case Data.Method.Post:
        return Post(path);
      case Data.Method.Delete:
        return Delete(path);
      default:
        throw new Error(`Unsupported [method=${method as string}]`);
    }
  };
}
