import { Module, Scope } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { UsersMongoModule } from './users-mongo.module'
import {AppLogger} from '@shared'
import {APP_INTERCEPTOR} from '@nestjs/core'

@Module({
    imports: [
        AuthModule,
        UserModule,
        UsersMongoModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            scope: Scope.REQUEST,
            useClass: AppLogger
        }
    ],
    exports: [],
})
export class UsersAppModule {}
