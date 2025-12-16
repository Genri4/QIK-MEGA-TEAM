import { IntersectionType } from '@nestjs/swagger';

import type { Constructable } from '@shared';

import { Data } from '../data';
import { Schema } from '../schema';

const LOG_TAG = 'ConfigSchemaFactory';

export class ConfigSchemaFactory {
  static create(scopes: Data.Scope[], service?: Data.Service): Constructable {
    const schemas: Constructable[] = [];

    scopes.forEach((scope) => {
      const expectedSchema = Schema.Scope.Self.find((i) => (i as any).scope === scope);
      if (expectedSchema) {
        schemas.push(expectedSchema);
      } else {
        console.error(LOG_TAG + `|create Schema [scope=${scope}] was not found`);
      }
    });
    if (service) {
      const expectedSchema = Schema.Service.Self.find((i) => (i as any).service === service);
      if (expectedSchema) {
        schemas.push(expectedSchema);
      } else {
        console.error(LOG_TAG + `|create Schema [service=${service}] was not found`);
      }
    }

    return IntersectionType(...schemas);
  }
}
