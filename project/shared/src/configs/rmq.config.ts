const rmqEnvPath = 'containers/rmq'
import {expand} from 'dotenv-expand'
expand(require('dotenv').config({ path: `${rmqEnvPath}/.env` }))

import {registerAs} from '@nestjs/config'
import { validateConfig } from '../lib/config.validator'

export type TConfig = {[k: string] : string|number}
const rmqConfig = registerAs('rmqConfig', (): TConfig => ({
    RABBIT_MQ_PORT: +(process.env.RABBIT_MQ_PORT as string ?? undefined),
    RABBIT_MQ_CONTAINER_NAME: process.env.RABBIT_MQ_CONTAINER_NAME as string ?? undefined,
    RABBIT_MQ_URI: process.env.RABBIT_MQ_URI as string ?? undefined,
    //RABBIT_MQ_USERS_QUEUE: process.env.RABBIT_MQ_USERS_QUEUE as string ?? undefined,
    RABBIT_MQ_NOTIFIER_QUEUE: process.env.RABBIT_MQ_NOTIFIER_QUEUE as string ?? undefined,
    //USERS_RMQ_NAME: process.env.USERS_RMQ_NAME as string ?? undefined,
    NOTIFIER_RMQ_NAME: process.env.NOTIFIER_RMQ_NAME as string ?? undefined,
}))
validateConfig(rmqConfig(), rmqEnvPath)

export {rmqConfig}
