import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddFeedRDO, AppError, DeleteFeedRDO, EId, ELoggerMessages, FeedsPrismaRepositoryService, ReturnedPostRDO, SortedPaginationDTO, TFeedId, TUserId, UserIdDTO } from '@shared';
import mongoose from 'mongoose';

@Injectable()
export class FeedService {
    constructor(
        private readonly feedsPrisma: FeedsPrismaRepositoryService,
    ){}
    async getUserFeed(ownerId: TUserId, sortedPagination: SortedPaginationDTO): Promise<ReturnedPostRDO[]> {
        try {
            const userFeed = await this.feedsPrisma.getUserFeed(ownerId, sortedPagination)
            return userFeed
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.badGateway,
                payload: {ownerId, sortedPagination},
            })
        }
    }
    async subscribe(ownerId: TUserId, userId: UserIdDTO): Promise<AddFeedRDO> {
        try {
            const {userId:donorId} = userId
            if(!mongoose.isValidObjectId(donorId)) {
                throw new HttpException(ELoggerMessages.coudNotSubscribe, HttpStatus.BAD_REQUEST)
            }
            const _feed = await this.feedsPrisma.prepareFeed(ownerId, donorId)
            const newFeedId = await this.feedsPrisma.save(_feed) as TFeedId
            return {result: !!(newFeedId)}
        } catch (error) {
            if ((error as {code: string}).code === ELoggerMessages.pgDuplicateItemCodeError) {
                throw new HttpException(ELoggerMessages.coudNotSubscribe, HttpStatus.CONFLICT)
            }
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.coudNotSubscribe,
                payload: {},
            })
        }
    }
    async unsubscribe(ownerId: TUserId, userId: UserIdDTO): Promise<DeleteFeedRDO> {
        try {
            const {userId:donorId} = userId
            if(!mongoose.isValidObjectId(donorId)) {
                throw new HttpException(ELoggerMessages.coudNotUnSubscribe, HttpStatus.BAD_REQUEST)
            }
            const _feedId = await this.feedsPrisma.findFeed(ownerId, donorId)
            const feedId = _feedId?.[0]?.[EId.id]
            if(!feedId) {
                throw new HttpException(ELoggerMessages.coudNotUnSubscribe, HttpStatus.NO_CONTENT)
            }
            const deleted = await this.feedsPrisma.delete(feedId)
            if(!deleted) {
                throw new HttpException(ELoggerMessages.coudNotUnSubscribe, HttpStatus.NO_CONTENT)
            }
            return {result: deleted}
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.coudNotUnSubscribe,
                payload: {},
            })
        }
    }
}
