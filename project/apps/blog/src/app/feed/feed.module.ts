import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { BlogPrismaModule } from '../blog-prisma.module';

@Module({
    imports: [BlogPrismaModule],
    controllers: [FeedController,],
    providers: [FeedService],
})
export class FeedModule {}
