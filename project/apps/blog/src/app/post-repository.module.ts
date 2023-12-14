import { Module } from '@nestjs/common';
import { PostRepositoryService } from '@project/libraries/shared';

@Module({
    providers: [PostRepositoryService],
    exports: [PostRepositoryService]
})
export class PostRepositoryModule {}
