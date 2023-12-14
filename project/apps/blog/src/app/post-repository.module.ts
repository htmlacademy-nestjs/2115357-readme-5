import { Module } from '@nestjs/common';
import { PostRepositoryService, TimeStampService } from '@project/libraries/shared';

@Module({
    providers: [PostRepositoryService, TimeStampService],
    exports: [PostRepositoryService, TimeStampService]
})
export class PostRepositoryModule {}
