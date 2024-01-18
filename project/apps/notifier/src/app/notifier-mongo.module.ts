import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { notifierConfig } from '@shared';

const _notifierConfig = notifierConfig()

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${_notifierConfig.NOTIFIER_INITDB_CONTAINER}:${_notifierConfig.NOTIFIER_INITDB_PORT}/${_notifierConfig.NOTIFIER_DEFAULT_DB_NAME}`, {
        user: `${_notifierConfig.NOTIFIER_INITDB_ROOT_USERNAME}`,
        pass: `${_notifierConfig.NOTIFIER_INITDB_ROOT_PASSWORD}`,
        authSource: 'admin',
    }),
  ],
  controllers: [],
})
export class NotifierMongoModule {}
