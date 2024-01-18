const mongoUsersEnvPath = 'containers/users/mongo/'
require('dotenv').config({ path: `${mongoUsersEnvPath}/.env` })

import {registerAs} from '@nestjs/config'
import { validateConfig } from '../lib/config.validator'

type TConfig = {[k: string] : string|number}
const mongoUsersConfig = registerAs('mongoUsersConfig', (): TConfig => ({
    MONGO_INITDB_CONTAINER: process.env.MONGO_INITDB_CONTAINER as string ?? undefined,
    MONGO_USERS_DEFAULT_DB_NAME: process.env.MONGO_USERS_DEFAULT_DB_NAME as string ?? undefined,
    MONGO_INITDB_ROOT_USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME as string ?? undefined,
    MONGO_INITDB_ROOT_PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD as string ?? undefined,
    MONGO_INITDB_PORT: +(process.env.MONGO_INITDB_PORT as string ?? undefined),
}))

validateConfig(mongoUsersConfig(), mongoUsersEnvPath)

export {mongoUsersConfig}
