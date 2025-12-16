import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwtService } from './jwt.service';
import { TokenExtractorService } from './extractors';
import { TokenResolverService } from './resolvers';

@Global()
@Module({
  imports: [ConfigModule],
  exports: [JwtService, TokenExtractorService, TokenResolverService],
  providers: [JwtService, TokenExtractorService, TokenResolverService],
})
export class JwtModule {}
