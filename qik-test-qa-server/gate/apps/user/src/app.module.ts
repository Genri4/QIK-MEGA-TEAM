import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chats, Messages, User, UserAuthMethod } from '@domains';
import { ConfigProvider } from '@infractract';
import { UserModule } from './user/user.module';

const ConfigModuleForRoot = ConfigProvider.forRoot(
  ['database', 'jwt', 'nats'],
  'gate',
);

@Module({
  imports: [
    ConfigModuleForRoot,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModuleForRoot],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Messages, User, UserAuthMethod, Chats],
        synchronize: true,
      }),
    }),

    UserModule,
  ],
})
export class AppModule {}
