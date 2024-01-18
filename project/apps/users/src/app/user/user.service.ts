import { HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common'
import {ClientProxy} from '@nestjs/microservices'
import {AppError, ChangeUserPasswordRDO, ELoggerMessages, ENotifierSubscriberFields, ERmqEvents, EUserDTOFields, HashPasswordService, ReturnedUserRDO, SubscribedToPostsRDO, TUserId, UserIdDTO, UserMongoRepositoryService, UserUpdatePasswordDTO, rmqConfig} from '@shared'
import {UserEntity} from 'shared/src/entities/user.entity'
import {Types} from 'mongoose'
import {lastValueFrom} from 'rxjs'

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserMongoRepositoryService,
        private readonly hashPasswordService: HashPasswordService,
        @Inject(`${rmqConfig().NOTIFIER_RMQ_NAME}`)
        private readonly notifierRqmService: ClientProxy
    ){}
    async findOne(userId: UserIdDTO): Promise<ReturnedUserRDO> {
        const {userId: id} = userId
        if(!id || !Types.ObjectId.isValid(id)) {
            throw new HttpException(`${id} ${ELoggerMessages.invalidId}`, HttpStatus.BAD_REQUEST)
        }
        try {
            const user = await this.userRepository.findOne(id)
            if(!user) {
                throw new HttpException(ELoggerMessages.notFound, HttpStatus.NOT_FOUND)
            }
            return await this.userRepository.prepareReturnedUser(user as UserEntity)
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.badGateway,
                payload: {userId},
            })
        }
    }
    async updatePassword(data: UserUpdatePasswordDTO, userId: TUserId): Promise<ChangeUserPasswordRDO> {
        try {
            const user = await this.userRepository.findOne(userId)
            if(!user) {
                throw new HttpException(ELoggerMessages.notFound, HttpStatus.NOT_FOUND)
            }
            const validated = user ? await this.hashPasswordService.compare(data.currentPassword, (user as UserEntity)[EUserDTOFields.password]) : false
            if(!validated) {
                throw new HttpException(ELoggerMessages.badCredentials, HttpStatus.UNAUTHORIZED)
            }
            const updated = await this.userRepository.update(userId, {[EUserDTOFields.password]: await this.hashPasswordService.hash(data[EUserDTOFields.password])})
            return {result: updated}
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.passwordNotChanged,
                payload: {userId},
            })
        }
    }
    async subscribeToNewPostsNotifier(userId: TUserId, interval: number): Promise<SubscribedToPostsRDO> {
        try {
            const {[EUserDTOFields.fullName]: name, [EUserDTOFields.email]: email} = await this.userRepository.findOne(userId) as ReturnedUserRDO
            return await lastValueFrom(this.notifierRqmService.send(ERmqEvents.subscribeToPosts, {
                [ENotifierSubscriberFields.email]: email,
                [ENotifierSubscriberFields.fullName]: name,
                [ENotifierSubscriberFields.interval]: interval,
            }))
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.coudNotSubscribe,
                payload: {userId},
            })
        }
    }
}
