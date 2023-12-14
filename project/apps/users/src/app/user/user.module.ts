import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepositoryModule } from '../user-repository.module';
import { UserMongoRepositoryModule } from '../user-mongo-repository.module';
import { BcryptService, HashPasswordService } from '@project/libraries/shared';

@Module({
    imports: [UserRepositoryModule, UserMongoRepositoryModule],
    controllers: [UserController],
    providers: [UserService,
        {
            provide: HashPasswordService,
            useClass: BcryptService
        }
    ],
    exports: []
})
export class UserModule {}
