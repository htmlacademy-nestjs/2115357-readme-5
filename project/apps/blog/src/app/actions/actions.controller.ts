import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { AddCommentRDO, AddPostRDO, AuthorizedUserId, CommentDTO, CommentIdDTO, DeleteCommentRDO, DeleteLikeRDO, DeletePostRDO, EBlogRouts, ERouteParams, LikeIdDTO, PostDTO, PostIdDTO, RePostRDO, RePublishPostDateDTO, TUserId, UpdatePostDTO, UpdatePostRDO } from '@shared';
import { ActionsService } from './actions.service';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    @ApiResponse({status: HttpStatus.UNAUTHORIZED})
    @ApiParam({name: ERouteParams.youtubeVideoUrl, description: 'http/https protocol is required'})
    @FormDataRequest({storage: FileSystemStoredFile})
    async addPost(@AuthorizedUserId() userId: TUserId, @Body() data: PostDTO): Promise<AddPostRDO> {
        return await this.actionsService.addPost(data, userId)
    }
    @Put(`${EBlogRouts.post}/:${ERouteParams.postId}`)
    @ApiConsumes('multipart/form-data')
    @ApiResponse({status: HttpStatus.BAD_REQUEST})
    @FormDataRequest({storage: FileSystemStoredFile})
    async editPost(@AuthorizedUserId() userId: TUserId, @Body() data: UpdatePostDTO, @Param() postId: PostIdDTO): Promise<UpdatePostRDO> {
        return await this.actionsService.editPost(data, postId, userId)
    }
    @Put(`${EBlogRouts.post}/${EBlogRouts.rePublish}/:${ERouteParams.postId}`)
    @ApiResponse({status: HttpStatus.BAD_REQUEST})
    async rePublishPost(@AuthorizedUserId() userId: TUserId, @Body() data: RePublishPostDateDTO, @Param() postId: PostIdDTO): Promise<UpdatePostRDO> {
        return await this.actionsService.rePublishPost(data, postId, userId)
    }
    @Delete(`${EBlogRouts.post}/:${ERouteParams.postId}`)
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({status: HttpStatus.NO_CONTENT})
    async delete(@AuthorizedUserId() userId: TUserId, @Param() postId: PostIdDTO): Promise<DeletePostRDO> {
        return await this.actionsService.deletePost(postId, userId)
    }
    //2.13
    @Post(`${EBlogRouts.post}/${EBlogRouts.repost}/:${ERouteParams.postId}`)
    @ApiResponse({status: HttpStatus.UNAUTHORIZED})
    @ApiResponse({status: HttpStatus.BAD_REQUEST})
    @ApiResponse({status: HttpStatus.BAD_GATEWAY})
    async repost(@AuthorizedUserId() userId: TUserId, @Param() postId: PostIdDTO): Promise<RePostRDO> {
        return await this.actionsService.repost(postId, userId)
    }
    /*
    5.1
    5.2
    -5.3
    */
    @Post(`${EBlogRouts.like}/:${ERouteParams.postId}`)
    @ApiResponse({status: HttpStatus.BAD_REQUEST})
    @ApiResponse({status: HttpStatus.BAD_GATEWAY})
    async addLike(@AuthorizedUserId() userId: TUserId, @Param() postId: PostIdDTO) {
        return await this.actionsService.addLike(postId, userId)
    }
    //-5.3
    @Delete(`${EBlogRouts.like}/:${ERouteParams.likeId}`)
    async deleteLike(@AuthorizedUserId() userId: TUserId, @Param() likeId: LikeIdDTO): Promise<DeleteLikeRDO> {
        return await this.actionsService.deleteLike(likeId, userId)
    }
    /*
    6.1
    6.2
    6.3
    */
    @Post(`${EBlogRouts.comment}/:${ERouteParams.postId}`)
    @ApiResponse({status: HttpStatus.BAD_REQUEST})
    @ApiResponse({status: HttpStatus.BAD_GATEWAY})
    async addComment(@AuthorizedUserId() userId: TUserId, @Body() data: CommentDTO, @Param() postId: PostIdDTO): Promise<AddCommentRDO> {
        return await this.actionsService.addComment(data, postId, userId)
    }
    //6.4
    @Delete(`${EBlogRouts.comment}/:${ERouteParams.commentId}`)
    async deleteComment(@AuthorizedUserId() userId: TUserId, @Param() commentId: CommentIdDTO): Promise<DeleteCommentRDO> {
        return await this.actionsService.deleteComment(commentId, userId)
    }
}
