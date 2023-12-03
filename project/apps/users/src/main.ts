import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { makeSwagger } from '@project/libraries/shared'

;(async function () {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix(process.env.API_PREFIX as string)
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    makeSwagger(app, {
        path: process.env.API_DOCS_PATH as string,
        title: process.env.API_DOCS_USER_TITLE as string,
        description: process.env.API_DOCS_USER_DESCRIPTION as string,
        version: process.env.API_PREFIX as string,
    })
    await app.listen(process.env.USERS_API_PORT as string)
    console.log('')
    console.log(`Users is running on: http://localhost:${process.env.USERS_API_PORT}/${process.env.API_PREFIX}`)
    console.log(`Users docs is running on: http://localhost:${process.env.USERS_API_PORT}/${process.env.API_DOCS_PATH}`)
    console.log('')
})();
