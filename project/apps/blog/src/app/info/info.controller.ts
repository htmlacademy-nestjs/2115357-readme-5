import { Controller, Get, HttpStatus, Param, Query, Req } from '@nestjs/common';
import {Request} from 'express'
import { CommentsPaginationDTO, EBlogRouts, ERouteParams, PaginationDTO, PostIdDTO, PostKeyphraseDTO, PostTagDTO, PostTypeDTO, ReturnedCommentRDO, ReturnedPostRDO, SortedPaginationDTO, TUserId, UserIdDTO } from '@project/libraries/shared';
import { InfoService } from './info.service';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getUserId } from '../actions/actions.controller';

@ApiTags(EBlogRouts.info)
@Controller(EBlogRouts.info)
export class InfoController {
    constructor(private readonly infoService: InfoService) {}
    //2.14
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
    @Get(`${EBlogRouts.posts}/${EBlogRouts.user}/:${ERouteParams.userId}`)
    async listUserPosts(
        @Param() userId: UserIdDTO,
        @Query() sortedPagination: SortedPaginationDTO
    ): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listUserPosts(userId, sortedPagination)
    }
    //3.9
    @Get(`${EBlogRouts.posts}/${EBlogRouts.drafts}`)
    async listUserDrafts(@Req() request: Request, ): Promise<ReturnedPostRDO[]> {
        /* TO DO pass authorized user id */
        const userId: TUserId = getUserId(/* request?.cookies?.user_id */'6588b7e00f80df08a6354a9e')
        return await this.infoService.listUserDrafts(userId)
    }
    //3.8
    @Get(`${EBlogRouts.posts}/${EBlogRouts.type}/:${ERouteParams.postType}`)
    async listPostsByType(@Param() postType: PostTypeDTO): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listPostsByType(postType)
    }
    //3.11
    @Get(`${EBlogRouts.posts}/${EBlogRouts.tag}/:${ERouteParams.postTag}`)
    async listPostsByTag(@Param() postTag: PostTagDTO): Promise<ReturnedPostRDO[]> {
        return await this.infoService.listPostsByTag(postTag)
    }
    /*
    6.5
    6.6
    */
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
    @Get(`${EBlogRouts.posts}/${EBlogRouts.search}/:${ERouteParams.keyphrase}`)
    async searchPosts(@Param() keyphrase: PostKeyphraseDTO): Promise<ReturnedPostRDO[]> {
        return await this.infoService.searchPosts(keyphrase)
    }
}
