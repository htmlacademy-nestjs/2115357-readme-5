import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddFeedRDO, DeleteFeedRDO, FeedsPrismaRepositoryService, ReturnedPostRDO, SortedPaginationDTO, TFeedId, TUserId, UserIdDTO } from '@project/libraries/shared';
import { EId } from 'libraries/shared/src/entities/db.entity';
import mongoose from 'mongoose';

@Injectable()
export class FeedService {
    constructor(
        private readonly feedsPrisma: FeedsPrismaRepositoryService,
    ){}
    async getUserFeed(ownerId: TUserId, sortedPagination: SortedPaginationDTO): Promise<ReturnedPostRDO[]> {
        const userFeed = await this.feedsPrisma.getUserFeed(ownerId, sortedPagination)
        if(userFeed === undefined) {
            throw new HttpException(`Could not get the feed for user ${ownerId}`, HttpStatus.BAD_GATEWAY)
        }
        return userFeed
    }
    async subscribe(ownerId: TUserId, userId: UserIdDTO): Promise<AddFeedRDO> {
        if(!mongoose.isValidObjectId(ownerId)) {
            throw new HttpException(`Unauthorized subscribe request`, HttpStatus.UNAUTHORIZED)
        }
        const {userId:donorId} = userId
        if(!mongoose.isValidObjectId(donorId)) {
            throw new HttpException(`Could not subscribe user ${ownerId} to user ${donorId}`, HttpStatus.BAD_REQUEST)
        }
        const _feed = await this.feedsPrisma.prepareFeed(ownerId, donorId)
        try {
            const newFeedId = await this.feedsPrisma.save(_feed) as TFeedId
            return {[EId.id]: newFeedId}
        }catch(er) {
            throw new HttpException(`Could not subscribe user ${ownerId} to user ${donorId}`, HttpStatus.CONFLICT)
        }
    }
    async unsubscribe(ownerId: TUserId, userId: UserIdDTO): Promise<DeleteFeedRDO> {
        if(!mongoose.isValidObjectId(ownerId)) {
            throw new HttpException(`Unauthorized unsubscribe request`, HttpStatus.UNAUTHORIZED)
        }
        const {userId:donorId} = userId
        if(!mongoose.isValidObjectId(donorId)) {
            throw new HttpException(`Could not unsubscribe user ${ownerId} from user ${donorId}`, HttpStatus.BAD_REQUEST)
        }
        const _feedId = await this.feedsPrisma.findFeed(ownerId, donorId)
        if(_feedId === undefined) {
            throw new HttpException(`Could not unsubscribe user ${ownerId} from user ${donorId}`, HttpStatus.BAD_GATEWAY)
        }
        const feedId = _feedId?.[0]?.[EId.id] ?? null
        if(!feedId) {
            throw new HttpException(`Could not unsubscribe user ${ownerId} from user ${donorId}`, HttpStatus.NO_CONTENT)
        }
        const deleted = await this.feedsPrisma.delete(feedId)
        if(!deleted) {
            throw new HttpException(`Could not unsubscribe user ${ownerId} from user ${donorId}`, HttpStatus.BAD_GATEWAY)
        }
        return {result: deleted}
    }
}
