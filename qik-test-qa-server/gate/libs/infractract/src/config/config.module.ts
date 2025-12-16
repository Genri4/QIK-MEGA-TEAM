import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateClass } from '@shared';

import { Data } from './data';
import { ConfigSchemaFactory, EnvPathFactory } from '@infractract/config/factories';

export class ConfigProvider {
  static forRoot(scopes: Data.Scope[], service?: Data.Service): Promise<DynamicModule> {
    return ConfigModule.forRoot({
      envFilePath: EnvPathFactory.create(scopes, service),
      isGlobal: true,
      validate: (config) => {
        return validateClass(ConfigSchemaFactory.create(scopes, service), config);
      },
    });
  }
}
