import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AuthGuardPassesUserIdToRequest, envConfig } from '@project/libraries/shared';

const _envConfig = envConfig()

;(async function() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(_envConfig.API_PREFIX as string)
    app.useGlobalGuards(new AuthGuardPassesUserIdToRequest(new Reflector()))
    await app.listen(+_envConfig.NOTIFIER_API_PORT)
    console.log(`Notifier is running on: http://localhost:${_envConfig.NOTIFIER_API_PORT}/${_envConfig.API_PREFIX}`)
})()
