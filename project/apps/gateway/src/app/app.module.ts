import { Module } from '@nestjs/common';
import { JwtModule } from './jwt/jwt.module';
import { CookiesModule } from './cookies/cookies.module';

@Module({
  imports: [JwtModule, CookiesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
