import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { ActionsModule } from './actions/actions.module';
import { PostsModule } from './info/info.module';
import { FeedModule } from './feed/feed.module';
import { config } from '@project/libraries/shared';

@Module({
  imports: [ActionsModule, PostsModule, FeedModule, ConfigModule.forFeature(config)],
  controllers: [],
  providers: [],
})
export class AppModule {}
