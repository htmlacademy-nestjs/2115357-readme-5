import {Body, Controller} from '@nestjs/common'
import {AddFeedRDO, DeleteFeedRDO, EBlogRouts, FeedDTO, FeedSubscribeDTO, FeedUnSubscribeDTO, ReturnedPostRDO} from '@shared'
import {FeedService} from './feed.service'
import {EventPattern} from '@nestjs/microservices'

@Controller()
export class FeedController {
    constructor(private readonly feedService: FeedService) {}
    /*
    4.2
    4.3
    4.4
    */
    @EventPattern(EBlogRouts.feed)
    async getUserFeed(@Body() data: FeedDTO): Promise<ReturnedPostRDO[]> {
        return await this.feedService.getUserFeed(data)
    }
    /*
    4.1
    -4.2
    4.5
    */
    @EventPattern(EBlogRouts.feedSubscribe)
    async subscribe(@Body() data: FeedSubscribeDTO): Promise<AddFeedRDO> {
        return await this.feedService.subscribe(data)
    }
    //4.6
    @EventPattern(EBlogRouts.feedUnSubscribe)
    async unsubscribe(@Body() data: FeedUnSubscribeDTO): Promise<DeleteFeedRDO> {
        return await this.feedService.unsubscribe(data)
    }
}
