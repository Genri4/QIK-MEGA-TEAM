import { Module } from '@nestjs/common';
import { ConfigProvider, LoggerModule, PasswordModule } from '@infractract';
import { JwtModule } from '@systems';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Chats, Messages, User, UserAuthMethod } from '@domains';
import { AiModule } from './ai/ai.module';

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
        entities: [User, UserAuthMethod, Chats, Messages],
        synchronize: true,
      }),
    }),

    PasswordModule,
    LoggerModule,
    JwtModule,

    AiModule,
    AuthModule,
    ChatsModule,
    MessagesModule,
    UserModule,
  ],
})
export class AppModule {}
