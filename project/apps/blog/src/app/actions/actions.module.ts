import { Module } from '@nestjs/common';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PostRepositoryModule } from '../post-repository.module';
import { BlogPrismaModule } from '../blog-prisma.module';

@Module({
    imports: [NestjsFormDataModule, PostRepositoryModule, BlogPrismaModule],
    controllers: [ActionsController],
    providers: [ActionsService],
})
export class ActionsModule {}
