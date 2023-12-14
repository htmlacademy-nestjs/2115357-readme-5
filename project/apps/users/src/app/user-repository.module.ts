import { Module } from '@nestjs/common';
import { UserRepositoryService } from '@project/libraries/shared';

@Module({
    providers: [UserRepositoryService],
    exports: [UserRepositoryService]
})
export class UserRepositoryModule {}
