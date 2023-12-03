import { Controller, Get, Param, Query } from '@nestjs/common';
import { EBlogRouts, ERouteParams, PaginationDTO, PostIdDTO, PostKeyphraseDTO, PostTagDTO, PostTypeDTO, SortedPaginationDTO, UserIdDTO } from '@project/libraries/shared';
import { InfoService } from './info.service';
import { ApiTags } from '@nestjs/swagger';
import { PostEntity } from 'libraries/shared/src/entities/post.entity';

@ApiTags(EBlogRouts.info)
@Controller(EBlogRouts.info)
export class InfoController {
    constructor(private readonly infoService: InfoService) {}
    //2.14
    @Get(`${EBlogRouts.posts}/${EBlogRouts.one}/:${ERouteParams.postId}`)
    async findOnePost(@Param() postId: PostIdDTO): Promise<PostEntity | undefined> {
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
    async listPosts(@Query() sortedPagination: SortedPaginationDTO): Promise<PostEntity[]> {
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
    ) {
        return await this.infoService.listUserPosts(userId, sortedPagination)
    }
    //3.9
    @Get(`${EBlogRouts.posts}/${EBlogRouts.drafts}`)
    async listUserDrafts() {
        return await this.infoService.listUserDrafts()
    }
    //3.8
    @Get(`${EBlogRouts.posts}/${EBlogRouts.type}/:${ERouteParams.postType}`)
    async listPostsByType(@Param() postType: PostTypeDTO) {
        return await this.infoService.listPostsByType(postType)
    }
    //3.11
    @Get(`${EBlogRouts.posts}/${EBlogRouts.tag}/:${ERouteParams.postTag}`)
    async listPostsByTag(@Param() postTag: PostTagDTO) {
        return await this.infoService.listPostsByTag(postTag)
    }
    /*
    6.5
    6.6
    */
    @Get(`${EBlogRouts.comments}/:${ERouteParams.postId}`)
    async listPostComments(
        @Param() postId: PostIdDTO,
        @Query() pagination: PaginationDTO
    ) {
        return await this.infoService.listPostComments(postId, pagination)
    }
    /*
    8.1
    8.2
    8.3
    */
    @Get(`${EBlogRouts.posts}/${EBlogRouts.search}/:${ERouteParams.keyphrase}`)
    async searchPosts(@Param() keyphrase: PostKeyphraseDTO) {
        return await this.infoService.searchPosts(keyphrase)
    }
}
