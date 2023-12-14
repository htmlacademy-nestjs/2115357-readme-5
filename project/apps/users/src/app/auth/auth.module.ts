import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import {  BcryptService, HashPasswordService } from '@project/libraries/shared';
import { UserRepositoryModule } from '../user-repository.module';
import { UserMongoRepositoryModule } from '../user-mongo-repository.module';

@Module({
    imports: [NestjsFormDataModule, UserRepositoryModule, UserMongoRepositoryModule],
    controllers: [AuthController],
    providers: [AuthService,
        {
            provide: HashPasswordService,
            useClass: BcryptService
        }
    ],
})
export class AuthModule {}
