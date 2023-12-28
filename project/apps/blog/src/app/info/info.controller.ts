import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { AuthorizedUserId, CommentsPaginationDTO, EBlogRouts, ERouteParams, PostIdDTO, PostKeyphraseDTO, PostTagDTO, PostTypeDTO, Public, ReturnedCommentRDO, ReturnedPostRDO, SortedPaginationDTO, TUserId, UserIdDTO } from '@project/libraries/shared';
import { InfoService } from './info.service';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags(EBlogRouts.info)
@Controller(EBlogRouts.info)
export class InfoController {
    constructor(private readonly infoService: InfoService) {}
    //2.14
    @Public()
    @Get(`${EBlogRouts.posts}/${EBlogRouts.one}/:${ERouteParams.postId}`)
    @ApiResponse({status: HttpStatus.NOT_FOUND})
    @ApiParam({ type: String, name: ERouteParams.postId, required: true })
    async findOnePost(@Param() postId: PostIdDTO): Promise<ReturnedPostRDO> {
        return await this.infoService.findOnePost(postId)
    }
    /*
    3.1
    3.2
    -3.5
    -3.6
    -3.7
    */
    @Public()
    @Get(`${EBlogRouts.posts}`)
    async listPosts(@Query() sortedPagination: SortedPaginationDTO): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listPosts(sortedPagination)
    }
    /*
    3.3
    -3.4
    -3.5
    -3.6
    -3.7
    */
    @Public()
    @Get(`${EBlogRouts.posts}/${EBlogRouts.user}/:${ERouteParams.userId}`)
    async listUserPosts(
        @Param() userId: UserIdDTO,
        @Query() sortedPagination: SortedPaginationDTO
    ): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listUserPosts(userId, sortedPagination)
    }
    //3.9
    @Get(`${EBlogRouts.posts}/${EBlogRouts.drafts}`)
    async listUserDrafts(@AuthorizedUserId() userId: TUserId): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listUserDrafts(userId)
    }
    //3.8
    @Public()
    @Get(`${EBlogRouts.posts}/${EBlogRouts.type}/:${ERouteParams.postType}`)
    async listPostsByType(@Param() postType: PostTypeDTO): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listPostsByType(postType)
    }
    //3.11
    @Public()
    @Get(`${EBlogRouts.posts}/${EBlogRouts.tag}/:${ERouteParams.postTag}`)
    async listPostsByTag(@Param() postTag: PostTagDTO): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listPostsByTag(postTag)
    }
    /*
    6.5
    6.6
    */
    @Public()
    @Get(`${EBlogRouts.comments}/:${ERouteParams.postId}`)
    async listPostComments(
        @Param() postId: PostIdDTO,
        @Query() pagination: CommentsPaginationDTO
    ): Promise<ReturnedCommentRDO[]> {
        return await this.infoService.listPostComments(postId, pagination)
    }
    /*
    8.1
    8.2
    8.3
    */
    @Public()
    @Get(`${EBlogRouts.posts}/${EBlogRouts.search}/:${ERouteParams.keyphrase}`)
    async searchPosts(@Param() keyphrase: PostKeyphraseDTO): Promise<ReturnedPostRDO[]> {
        return await this.infoService.searchPosts(keyphrase)
    }
}
