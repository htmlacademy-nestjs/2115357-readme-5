import { Module } from '@nestjs/common';
import { CookiesController } from './cookies.controller';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from '@shared';

@Module({
    imports: [
        ConfigModule.forFeature(jwtConfig),
    ],
    controllers: [CookiesController],
    providers: [],
})
export class CookiesModule {}
