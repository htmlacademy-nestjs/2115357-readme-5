import { Module } from '@nestjs/common';
import { BlogPrismaService, FeedsPrismaRepositoryService, PostsPrismaRepositoryService, CommentsPrismaRepositoryService, LikesPrismaRepositoryService} from '@project/libraries/shared';

@Module({
    providers: [BlogPrismaService, PostsPrismaRepositoryService, LikesPrismaRepositoryService, FeedsPrismaRepositoryService, CommentsPrismaRepositoryService],
    exports: [BlogPrismaService, PostsPrismaRepositoryService, LikesPrismaRepositoryService, FeedsPrismaRepositoryService, CommentsPrismaRepositoryService]
})
export class BlogPrismaModule {}
