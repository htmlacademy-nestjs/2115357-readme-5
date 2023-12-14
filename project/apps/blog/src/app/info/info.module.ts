import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { PostRepositoryModule } from '../post-repository.module';

@Module({
    imports: [PostRepositoryModule],
    controllers: [InfoController,],
    providers: [InfoService],
})
export class PostsModule {}
