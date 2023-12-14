import { Injectable } from '@nestjs/common';
import { PostRepositoryService, SortedPaginationDTO, UserIdDTO } from '@project/libraries/shared';

@Injectable()
export class FeedService {
    constructor(private readonly postRepository: PostRepositoryService){}
    async getUserFeed(sortedPagination: SortedPaginationDTO) {
        console.log(sortedPagination, 'getUserFeed')
        return 'got UserFeed'
    }
    async subscribe(userId: UserIdDTO) {
        console.log(userId, 'subscribe')
        return 'subscribed'
    }
    async unsubscribe(userId: UserIdDTO) {
        console.log(userId, 'unsubscribe')
        return 'unsubscribed'
    }
}
