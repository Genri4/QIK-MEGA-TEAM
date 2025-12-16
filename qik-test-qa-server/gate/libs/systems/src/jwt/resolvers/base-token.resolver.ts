import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from '@infractract/config';

export class BaseTokenResolver {
  constructor(protected readonly config: ConfigService<ConfigSchema.Scope.JWT>) {}
}
