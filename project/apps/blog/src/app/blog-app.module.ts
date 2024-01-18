import { Module, Scope } from '@nestjs/common';
import { ActionsModule } from './actions/actions.module';
import { PostsModule } from './info/info.module';
import { FeedModule } from './feed/feed.module';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {AppLogger} from '@shared';

@Module({
    imports: [ActionsModule, PostsModule, FeedModule,],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            scope: Scope.REQUEST,
            useClass: AppLogger
        }
    ],
})
export class BlogAppModule {}
