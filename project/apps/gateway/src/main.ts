import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { envConfig, makeSwagger } from '@project/libraries/shared';
import cookieParser from 'cookie-parser';

const _envConfig = envConfig()

;(async function () {
    try {
        const app = await NestFactory.create(AppModule)
        app.setGlobalPrefix(_envConfig.API_PREFIX as string)
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }))
        makeSwagger(app, {
            path: `${_envConfig.API_DOCS_PATH}`,
            title: `${_envConfig.API_DOCS_GATEWAY_TITLE}`,
            description: `${_envConfig.API_DOCS_GATEWAY_DESCRIPTION}`,
            version: `${_envConfig.API_PREFIX}`,
        })
        app.use(cookieParser())
        await app.listen(+_envConfig.GATEWAY_API_PORT)
        console.log('')
        console.log(`Gateway is running on: http://localhost:${_envConfig.GATEWAY_API_PORT}/${_envConfig.API_PREFIX}`)
        console.log(`Gateway docs is running on: http://localhost:${_envConfig.GATEWAY_API_PORT}/${_envConfig.API_DOCS_PATH}`)
        console.log('')
    }catch(er) {
        console.log(er)
    }
})()
