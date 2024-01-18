import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import {BcryptService, HashPasswordService} from '@shared';
import { UserMongoRepositoryModule } from '../user-mongo-repository.module';

@Module({
    imports: [
        NestjsFormDataModule,
        UserMongoRepositoryModule
    ],
    controllers: [AuthController],
    providers: [AuthService,
        {
            provide: HashPasswordService,
            useClass: BcryptService
        }
    ],
})
export class AuthModule {}
