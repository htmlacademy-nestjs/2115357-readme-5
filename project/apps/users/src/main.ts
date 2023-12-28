import { ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { AuthGuardPassesUserIdToRequest, envConfig, makeSwagger } from '@project/libraries/shared'

const _envConfig = envConfig()

;(async function () {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix(`${_envConfig.API_PREFIX}`)
    app.useGlobalGuards(new AuthGuardPassesUserIdToRequest(new Reflector()))
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    makeSwagger(app, {
        path: `${_envConfig.API_DOCS_PATH}`,
        title: `${_envConfig.API_DOCS_USER_TITLE}`,
        description: `${_envConfig.API_DOCS_USER_DESCRIPTION}`,
        version: `${_envConfig.API_PREFIX}`,
    })
    await app.listen(+_envConfig.USERS_API_PORT)
    console.log('')
    console.log(`Users is running on: http://localhost:${_envConfig.USERS_API_PORT}/${_envConfig.API_PREFIX}`)
    console.log(`Users docs is running on: http://localhost:${_envConfig.USERS_API_PORT}/${_envConfig.API_DOCS_PATH}`)
    console.log('')
})();
