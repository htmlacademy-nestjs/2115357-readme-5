import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CommentDTO, CommentIdDTO, EBlogRouts, ERouteParams, LikeIdDTO, PostDTO, PostIdDTO, UpdatePostDTO } from '@project/libraries/shared';
import { ActionsService } from './actions.service';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags(EBlogRouts.actions)
@Controller(EBlogRouts.actions)
export class ActionsController {
    constructor(private readonly actionsService: ActionsService) {}
    /*
    2.1
    2.2
    2.3
    2.4
    2.5
    2.6
    2.7
    2.8
    2.9
    2.10
    2.11
    2.12?
    */
    @Post(EBlogRouts.post)
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({storage: FileSystemStoredFile})
    async addPost(@Body() data: PostDTO) {
        return await this.actionsService.addPost(data)
    }
    @Put(`${EBlogRouts.post}/:${ERouteParams.postId}`)
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({storage: FileSystemStoredFile})
    async editPost(@Body() data: UpdatePostDTO, @Param() postId: PostIdDTO) {
        return await this.actionsService.editPost(data, postId)
    }
    @Delete(`${EBlogRouts.post}/:${ERouteParams.postId}`)
    async delete(@Param() postId: PostIdDTO) {
        return await this.actionsService.deletePost(postId)
    }
    //2.13
    @Post(`${EBlogRouts.repost}/:${ERouteParams.postId}`)
    async repost(@Param() postId: PostIdDTO) {
        return await this.actionsService.repost(postId)
    }
    /*
    5.1
    5.2
    -5.3
    */
    @Post(`${EBlogRouts.like}/:${ERouteParams.postId}`)
    async addLike(@Param() postId: PostIdDTO) {
        return await this.actionsService.addLike(postId)
    }
    //-5.3
    @Delete(`${EBlogRouts.like}/:${ERouteParams.likeId}`)
    async deleteLike(@Param() likeId: LikeIdDTO) {
        return await this.actionsService.deleteLike(likeId)
    }
    /*
    6.1
    6.2
    6.3
    */
    @Post(`${EBlogRouts.comment}/:${ERouteParams.postId}`)
    async addComment(@Body() data: CommentDTO, @Param() postId: PostIdDTO) {
        return await this.actionsService.addComment(data, postId)
    }
    //6.4
    @Delete(`${EBlogRouts.comment}/:${ERouteParams.commentId}`)
    async deleteComment(@Param() commentId: CommentIdDTO) {
        return await this.actionsService.deleteComment(commentId)
    }
}
