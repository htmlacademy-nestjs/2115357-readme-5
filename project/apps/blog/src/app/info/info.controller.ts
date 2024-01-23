import {Body, Controller} from '@nestjs/common'
import {CommentsPaginationDTO, EBlogRouts, PostIdDTO, PostKeyphraseDTO, PostTagDTO, PostTypeDTO, ReturnedCommentRDO, ReturnedPostRDO, SortedPaginationDTO, TUserId, UserPostsDTO} from '@shared'
import {InfoService} from './info.service'
import {EventPattern} from '@nestjs/microservices'

@Controller()
export class InfoController {
    constructor(private readonly infoService: InfoService) {}

    //2.14
    @EventPattern(EBlogRouts.one)
    async findOnePost(@Body() data: PostIdDTO): Promise<ReturnedPostRDO> {
        return await this.infoService.findOnePost(data)
    }

    /*
    3.1
    3.2
    -3.5
    -3.6
    -3.7
    */
    @EventPattern(EBlogRouts.posts)
    async listPosts(@Body() data: SortedPaginationDTO): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listPosts(data)
    }

    /*
    3.3
    -3.4
    -3.5
    -3.6
    -3.7
    */
    @EventPattern(EBlogRouts.userPosts)
    async listUserPosts(@Body() data: UserPostsDTO): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listUserPosts(data)
    }

    //3.9
    @EventPattern(EBlogRouts.drafts)
    async listUserDrafts(@Body() data: TUserId): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listUserDrafts(data)
    }

    //3.8
    @EventPattern(EBlogRouts.type)
    async listPostsByType(@Body() postType: PostTypeDTO): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listPostsByType(postType)
    }

    //3.11
    @EventPattern(EBlogRouts.tag)
    async listPostsByTag(@Body() postTag: PostTagDTO): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listPostsByTag(postTag)
    }

    /*
    6.5
    6.6
    */
    @EventPattern(EBlogRouts.comments)
    async listPostComments(@Body() data: CommentsPaginationDTO): Promise<ReturnedCommentRDO[]> {
        return await this.infoService.listPostComments(data)
    }

    /*
    8.1
    8.2
    8.3
    */
    @EventPattern(EBlogRouts.search)
    async searchPosts(@Body() keyphrase: PostKeyphraseDTO): Promise<ReturnedPostRDO[]> {
        return await this.infoService.searchPosts(keyphrase)
    }
}
