import cookieParser from 'cookie-parser';
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
        title: `${_envConfig.API_DOCS_BLOG_TITLE}`,
        description: `${_envConfig.API_DOCS_BLOG_DESCRIPTION}`,
        version: `${_envConfig.API_PREFIX}`,
    })
    app.use(cookieParser())
    await app.listen(+_envConfig.BLOG_API_PORT)
    console.log('')
    console.log(`Blog is running on: http://localhost:${_envConfig.BLOG_API_PORT}/${_envConfig.API_PREFIX}`)
    console.log(`Blog docs is running on: http://localhost:${_envConfig.BLOG_API_PORT}/${_envConfig.API_DOCS_PATH}`)
    console.log('')
})();
