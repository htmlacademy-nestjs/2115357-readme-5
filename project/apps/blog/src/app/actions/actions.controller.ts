import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import {Request} from 'express'
import { AddCommentRDO, AddPostRDO, CommentDTO, CommentIdDTO, DeleteCommentRDO, DeleteLikeRDO, DeletePostRDO, EBlogRouts, ERouteParams, LikeIdDTO, PostDTO, PostIdDTO, RePostRDO, RePublishPostDateDTO, TPostId, TUserId, UpdatePostDTO, UpdatePostRDO } from '@project/libraries/shared';
import { ActionsService } from './actions.service';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import mongoose, { Types } from 'mongoose';

export const getUserId = (cookiedId: string|undefined):Types.ObjectId => {
    let _userId = {} as Types.ObjectId|null
    try {
        _userId = cookiedId ? new mongoose.Types.ObjectId(cookiedId) : null
    }catch(er) {
        _userId = null
    }
    return _userId && `${_userId}` === cookiedId ? _userId : new mongoose.Types.ObjectId();
}

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
    @FormDataRequest({storage: FileSystemStoredFile})
    async addPost(@Req() request: Request, @Body() data: PostDTO): Promise<AddPostRDO> {
        /* TO DO pass authorized user id */
        const userId: TUserId = getUserId(request?.cookies?.user_id/* '6588b7e00f80df08a6354a9e' */)
        return await this.actionsService.addPost(data, userId)
    }
    @Put(`${EBlogRouts.post}/:${ERouteParams.postId}`)
    @ApiConsumes('multipart/form-data')
    @ApiResponse({status: HttpStatus.BAD_REQUEST})
    @FormDataRequest({storage: FileSystemStoredFile})
    async editPost(@Body() data: UpdatePostDTO, @Param() postId: PostIdDTO): Promise<UpdatePostRDO> {
        return await this.actionsService.editPost(data, postId)
    }
    @Put(`${EBlogRouts.post}/${EBlogRouts.rePublish}/:${ERouteParams.postId}`)
    @ApiResponse({status: HttpStatus.BAD_REQUEST})
    async rePublishPost(@Body() data: RePublishPostDateDTO, @Param() postId: PostIdDTO): Promise<UpdatePostRDO> {
        return await this.actionsService.rePublishPost(data, postId)
    }
    @Delete(`${EBlogRouts.post}/:${ERouteParams.postId}`)
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({status: HttpStatus.NO_CONTENT})
    async delete(@Param() postId: PostIdDTO): Promise<DeletePostRDO> {
        return await this.actionsService.deletePost(postId)
    }
    //2.13
    @Post(`${EBlogRouts.post}/${EBlogRouts.repost}/:${ERouteParams.postId}`)
    @ApiResponse({status: HttpStatus.UNAUTHORIZED})
    @ApiResponse({status: HttpStatus.BAD_REQUEST})
    @ApiResponse({status: HttpStatus.BAD_GATEWAY})
    async repost(@Req() request: Request, @Param() postId: PostIdDTO): Promise<RePostRDO> {
        /* TO DO pass authorized user id */
        const userId: TUserId = getUserId(request?.cookies?.user_id)
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
    async addLike(@Req() request: Request, @Param() postId: PostIdDTO) {
        /* TO DO pass authorized user id */
        const userId: TUserId = getUserId(/* request?.cookies?.user_id */'6588b7e00f80df08a6354a90')
        return await this.actionsService.addLike(postId, userId)
    }
    //-5.3
    @Delete(`${EBlogRouts.like}/:${ERouteParams.likeId}`)
    async deleteLike(@Param() likeId: LikeIdDTO): Promise<DeleteLikeRDO> {
        return await this.actionsService.deleteLike(likeId)
    }
    /*
    6.1
    6.2
    6.3
    */
    @Post(`${EBlogRouts.comment}/:${ERouteParams.postId}`)
    @ApiResponse({status: HttpStatus.BAD_REQUEST})
    @ApiResponse({status: HttpStatus.BAD_GATEWAY})
    async addComment(@Req() request: Request, @Body() data: CommentDTO, @Param() postId: PostIdDTO): Promise<AddCommentRDO> {
        /* TO DO pass authorized user id */
        const userId: TUserId = getUserId(request?.cookies?.user_id)
        return await this.actionsService.addComment(data, postId, userId)
    }
    //6.4
    @Delete(`${EBlogRouts.comment}/:${ERouteParams.commentId}`)
    async deleteComment(@Param() commentId: CommentIdDTO): Promise<DeleteCommentRDO> {
        return await this.actionsService.deleteComment(commentId)
    }
}
