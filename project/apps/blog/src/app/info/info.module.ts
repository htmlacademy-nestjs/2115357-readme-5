import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { PostRepositoryModule } from '../post-repository.module';
import { BlogPrismaModule } from '../blog-prisma.module';

@Module({
    imports: [PostRepositoryModule, BlogPrismaModule],
    controllers: [InfoController,],
    providers: [InfoService],
})
export class PostsModule {}
