import { Module } from '@nestjs/common';
import {JwtModule as _JwtModule} from '@nestjs/jwt'
import { JwtController } from './jwt.controller';
import { JwtService } from './jwt.service';
import { jwtConfig } from '@project/libraries/shared';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        _JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
    ],
    controllers: [JwtController],
    providers: [JwtService],
})
export class JwtModule {}
