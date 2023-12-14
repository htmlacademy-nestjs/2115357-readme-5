import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

;(async function() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(process.env.API_PREFIX as string)
    await app.listen(process.env.NOTIFIER_API_PORT as string)
    console.log(`Notifier is running on: http://localhost:${process.env.NOTIFIER_API_PORT}/${process.env.API_PREFIX}`)
})()
