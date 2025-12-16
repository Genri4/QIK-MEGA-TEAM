import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import type { Constructable } from '@shared';

export const validateClass = (schema: Constructable, object: Record<string, unknown>): Record<string, unknown> => {
  const validationConfig = plainToInstance(schema, object, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validationConfig as Record<string, unknown>, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    // @todo move to custom error
    throw Error(
      `validateClass Class is not valid: ${errors
        .map((e) => e.property + ' must be ' + Object.keys(e.constraints || {}).toLocaleString())
        .join(';')}`,
    );
  }

  return validationConfig as Record<string, unknown>;
};
