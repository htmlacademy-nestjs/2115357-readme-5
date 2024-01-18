import {NestFactory} from '@nestjs/core'
import {AppModule} from './app/notifier.module'
import {AppError, ELoggerMessages, RmqService, envConfig, notifierConfig, rmqConfig} from '@shared'

const _envConfig = envConfig()
const _rmqConfig = rmqConfig()
const _notifierConfig = notifierConfig()

;(async function() {
    try {
        const app = await NestFactory.create(AppModule);
        const rmqService = app.get<RmqService>(RmqService)
        app.connectMicroservice(rmqService.getOptions(`${_rmqConfig.NOTIFIER_RMQ_NAME}`))
        await app.startAllMicroservices()
        app.setGlobalPrefix(_envConfig.API_PREFIX as string)
        await app.listen(+_envConfig.NOTIFIER_API_PORT)
        console.log('')
        console.log(`Notifier is running on: amqp://${_rmqConfig.RABBIT_MQ_CONTAINER_NAME}:${_rmqConfig.RABBIT_MQ_PORT}`)
        console.log(`Notifier smtp server is running on: {host}:${_notifierConfig.NOTIFIER_SMTP_PORT}`)
        console.log(`Notifier smtp web server is running on: {protocol}://{host}:${_notifierConfig.NOTIFIER_SERVER_PORT}`)
        console.log(`Notifier smtp management server is running on: {protocol}://{host}:${_notifierConfig.NOTIFIER_MANAGEMENT_SERVER_PORT}`)
        console.log('')
    } catch (error) {
        throw new AppError({
            error,
            responseMessage: ELoggerMessages.badGateway,
            payload: {},
        })
    }
})()
