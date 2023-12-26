import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PostRepositoryModule } from '../post-repository.module';
import { BlogPrismaModule } from '../blog-prisma.module';

@Module({
    imports: [PostRepositoryModule, BlogPrismaModule],
    controllers: [FeedController,],
    providers: [FeedService],
})
export class FeedModule {}
