import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { BlogPrismaModule } from '../blog-prisma.module';

@Module({
    imports: [BlogPrismaModule],
    controllers: [InfoController,],
    providers: [InfoService],
})
export class PostsModule {}
