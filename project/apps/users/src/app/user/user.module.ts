import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserMongoRepositoryModule } from '../user-mongo-repository.module';
import { BcryptService, HashPasswordService, RmqModule, rmqConfig } from '@shared';

const _rmqConfig = rmqConfig()

@Module({
    imports: [
        UserMongoRepositoryModule,
        RmqModule.register({
            name: `${_rmqConfig.NOTIFIER_RMQ_NAME}`
        }),
    ],
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
