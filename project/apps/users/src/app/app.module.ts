import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { config } from '@project/libraries/shared';

@Module({
  imports: [AuthModule, UserModule, ConfigModule.forFeature(config)],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
