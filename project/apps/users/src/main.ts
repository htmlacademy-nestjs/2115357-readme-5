import { ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { UsersAppModule } from './app/users-app.module'
import { AppError, AuthGuardPassesUserIdToRequest, ELoggerMessages, envConfig, makeSwagger} from '@shared'

const _envConfig = envConfig()

;(async function () {
    try {
        const app = await NestFactory.create(UsersAppModule)
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
        console.info('')
        console.info(`Users is running on: http://localhost:${_envConfig.USERS_API_PORT}/${_envConfig.API_PREFIX}`)
        console.info(`Users docs is running on: http://localhost:${_envConfig.USERS_API_PORT}/${_envConfig.API_DOCS_PATH}`)
        console.info('')
    } catch (error) {
        throw new AppError({
            error,
            responseMessage: ELoggerMessages.badGateway,
            payload: {},
        })
    }
})();
