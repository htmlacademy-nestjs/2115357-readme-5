import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { EBlogRouts, ERouteParams, SortedPaginationDTO, UserIdDTO } from '@project/libraries/shared';
import { FeedService } from './feed.service';
import { ApiTags } from '@nestjs/swagger';

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
    async getUserFeed(@Query() sortedPagination: SortedPaginationDTO) {
        return await this.feedService.getUserFeed(sortedPagination)
    }
    /*
    4.1
    -4.2
    4.5
    */
    @Post(`/:${ERouteParams.userId}`)
    async subscribe(@Param() userId: UserIdDTO) {
        return await this.feedService.subscribe(userId)
    }
    //4.6
    @Delete(`/:${ERouteParams.userId}`)
    async unsubscribe(@Param() userId: UserIdDTO) {
        return await this.feedService.unsubscribe(userId)
    }
}
