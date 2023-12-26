import { Controller, Delete, Get, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import { AddFeedRDO, DeleteFeedRDO, EBlogRouts, ERouteParams, ReturnedPostRDO, SortedPaginationDTO, TUserId, UserIdDTO } from '@project/libraries/shared';
import { FeedService } from './feed.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { getUserId } from '../actions/actions.controller';
import {Request} from 'express'

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
    async getUserFeed(@Req() request: Request, @Query() sortedPagination: SortedPaginationDTO): Promise<ReturnedPostRDO[]> {
        const ownerId: TUserId = getUserId(/* request?.cookies?.user_id */'6588b7e00f80df08a6354a9e')
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
    async subscribe(@Req() request: Request, @Param() userId: UserIdDTO): Promise<AddFeedRDO> {
        /* TO DO pass authorized user id */
        const ownerId: TUserId = getUserId(/* request?.cookies?.user_id */'6588b7e00f80df08a6354a9e')
        const donorId = userId
        return await this.feedService.subscribe(ownerId, donorId)
    }
    //4.6
    @Delete(`/:${ERouteParams.userId}`)
    async unsubscribe(@Req() request: Request, @Param() userId: UserIdDTO): Promise<DeleteFeedRDO> {
        /* TO DO pass authorized user id */
        const ownerId: TUserId = getUserId(/* request?.cookies?.user_id */'6588b7e00f80df08a6354a9e')
        const donorId = userId
        return await this.feedService.unsubscribe(ownerId, donorId)
    }
}
