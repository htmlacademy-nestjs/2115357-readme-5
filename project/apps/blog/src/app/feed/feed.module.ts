import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PostRepositoryModule } from '../post-repository.module';

@Module({
    imports: [PostRepositoryModule],
    controllers: [FeedController,],
    providers: [FeedService],
})
export class FeedModule {}
