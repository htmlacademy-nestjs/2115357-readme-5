import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepositoryModule } from '../user-repository.module';

@Module({
    imports: [UserRepositoryModule],
    controllers: [UserController],
    providers: [UserService],
    exports: []
})
export class UserModule {}
