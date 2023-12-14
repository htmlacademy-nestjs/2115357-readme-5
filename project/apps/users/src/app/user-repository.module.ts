import { Module } from '@nestjs/common';
import { TimeStampService, UserRepositoryService } from '@project/libraries/shared';

@Module({
    providers: [UserRepositoryService, TimeStampService],
    exports: [UserRepositoryService, TimeStampService]
})
export class UserRepositoryModule {}
