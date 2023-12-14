import { Module } from '@nestjs/common';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [JwtModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
