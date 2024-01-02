import { Controller, Delete, Get, HttpStatus, Param, Post, Query} from '@nestjs/common';
import { AddFeedRDO, AuthorizedUserId, DeleteFeedRDO, EBlogRouts, ERouteParams, ReturnedPostRDO, SortedPaginationDTO, TUserId, UserIdDTO } from '@project/libraries/shared';
import { FeedService } from './feed.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags(EBlogRouts.feed)
@Controller(EBlogRouts.feed)
export class FeedController {
    constructor(private readonly feedService: FeedService) {}
    /*
    4.2
    4.3
    4.4
    */
    @Get()
    async getUserFeed(@AuthorizedUserId() ownerId: TUserId, @Query() sortedPagination: SortedPaginationDTO): Promise<ReturnedPostRDO[]> {
        return await this.feedService.getUserFeed(ownerId, sortedPagination)
    }
    /*
    4.1
    -4.2
    4.5
    */
    @Post(`/:${ERouteParams.userId}`)
    @ApiResponse({status: HttpStatus.UNAUTHORIZED})
    @ApiResponse({status: HttpStatus.NO_CONTENT})
    @ApiResponse({status: HttpStatus.BAD_REQUEST})
    @ApiResponse({status: HttpStatus.BAD_GATEWAY})
    @ApiResponse({status: HttpStatus.CONFLICT})
    async subscribe(@AuthorizedUserId() ownerId: TUserId, @Param() userId: UserIdDTO): Promise<AddFeedRDO> {
        const donorId = userId
        return await this.feedService.subscribe(ownerId, donorId)
    }
    //4.6
    @Delete(`/:${ERouteParams.userId}`)
    async unsubscribe(@AuthorizedUserId() ownerId: TUserId, @Param() userId: UserIdDTO): Promise<DeleteFeedRDO> {
        const donorId = userId
        return await this.feedService.unsubscribe(ownerId, donorId)
    }
}
