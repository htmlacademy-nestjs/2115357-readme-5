import { Module } from '@nestjs/common';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PostRepositoryModule } from '../post-repository.module';

@Module({
    imports: [NestjsFormDataModule, PostRepositoryModule],
    controllers: [ActionsController],
    providers: [ActionsService],
})
export class ActionsModule {}
