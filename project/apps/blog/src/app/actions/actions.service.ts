import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import { AddCommentRDO, AddLikeRDO, AddPostRDO, AppError, CommentDTO, CommentIdDTO, CommentsPrismaRepositoryService, DeleteCommentRDO, DeleteLikeRDO, DeletePostRDO, EId, ELoggerMessages, ENotifierQueueFields, EPostDTOFields, EPostDbEntityFields, EPostState, ERmqEvents, LikeIdDTO, LikesPrismaRepositoryService, PostDTO, PostIdDTO, PostsPrismaRepositoryService, RePostRDO, RePublishPostDateDTO, ReturnedPostRDO, TCommentId, TLikeId, TPostEntity, TPostId, TTagsConnectOrCreate, TUserId, UpdatePostDTO, UpdatePostRDO, rmqConfig} from '@shared';
import {lastValueFrom} from 'rxjs'

@Injectable()
export class ActionsService {
    constructor(
        private readonly postsPrisma: PostsPrismaRepositoryService,
        private readonly likesPrisma: LikesPrismaRepositoryService,
        private readonly commentsPrisma: CommentsPrismaRepositoryService,
        @Inject(`${rmqConfig().NOTIFIER_RMQ_NAME}`)
        private readonly notifierRqmService: ClientProxy
        ){}
    async #addPostToNotifierQueue(data: PostDTO, newPostId:TPostId, userId: TUserId): Promise<boolean> {
        try {
            return await lastValueFrom(this.notifierRqmService.send(ERmqEvents.addPostToQueue, {
               [ENotifierQueueFields.postId]: newPostId,
               [ENotifierQueueFields.postType]: data[EPostDTOFields.postType],
               [ENotifierQueueFields.authorId]: userId,
            }))
        } catch (er) {
            return false
        }
    }
    async addPost(data: PostDTO, userId: TUserId): Promise<AddPostRDO> {
        try {
            const _post = await this.postsPrisma.preparePost(data, `${userId}`, true)
            const newPostId = await this.postsPrisma.save(_post as Required<Pick<TPostEntity, EPostDbEntityFields.userId>> & TTagsConnectOrCreate & TPostEntity)
            const addedToNotifierQueue = await this.#addPostToNotifierQueue(data, newPostId, userId)
            return {[EId.id]: newPostId, notifier: addedToNotifierQueue ? ELoggerMessages.addedToQueue :  ELoggerMessages.willAddToQueue}
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.couldNotAddPost,
                payload: {data, userId},
            })
        }
    }
    async editPost(data: UpdatePostDTO, postId: PostIdDTO, userId: TUserId): Promise<UpdatePostRDO> {
        try {
            const{postId:id} = postId
            const _post = await this.postsPrisma.preparePost(data)
            const _where = await this.postsPrisma.getWhereParameters({[EPostDbEntityFields.userId]: `${userId}`}, false)
            const updated = await this.postsPrisma.update(id, _post, _where)
            if(!updated) {
                throw new HttpException(ELoggerMessages.postWasNotUpdated, HttpStatus.BAD_REQUEST)
            }
            return {result: updated}
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.postWasNotUpdated,
                payload: {data, postId, userId},
            })
        }
    }
    async rePublishPost(data: RePublishPostDateDTO, postId: PostIdDTO, userId: TUserId): Promise<UpdatePostRDO> {
        try {
            const{postId:id} = postId
            const _post = await this.postsPrisma.prepareRepublishedPost(data) as TPostEntity
            const _where = await this.postsPrisma.getWhereParameters({[EPostDbEntityFields.userId]: `${userId}`}, false)
            const updated = await this.postsPrisma.update(id, _post, _where)
            if(!updated) {
                throw new HttpException(ELoggerMessages.postPublishingDateWasNotUpdated, HttpStatus.BAD_REQUEST)
            }
            return {result: updated}
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.postPublishingDateWasNotUpdated,
                payload: {data, postId, userId},
            })
        }
    }
    async deletePost(postId: PostIdDTO, userId: TUserId): Promise<DeletePostRDO> {
        try {
            const{postId:id} = postId
            const _where = await this.postsPrisma.getWhereParameters({[EPostDbEntityFields.userId]: `${userId}`}, false)
            const deleted = await this.postsPrisma.delete(id, _where)
            if(!deleted) {
                throw new HttpException(`${ELoggerMessages.couldNotDeletePost} or ${ELoggerMessages.notFound}`, HttpStatus.NO_CONTENT)
            }
            return {result: deleted}
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: `${ELoggerMessages.couldNotDeletePost} or ${ELoggerMessages.notFound}`,
                payload: {postId, userId},
            })
        }
    }
    async repost(postId: PostIdDTO, userId: TUserId): Promise<RePostRDO> {
        try {
            const{postId:id} = postId
            const newRepostedPostId = await this.postsPrisma.repost(id, `${userId}`)
            if(!newRepostedPostId) {
                throw new HttpException(`${ELoggerMessages.couldNotRepostPost} or ${ELoggerMessages.notFound}`, HttpStatus.BAD_REQUEST)
            }
            return {[EId.id]: newRepostedPostId}
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.couldNotRepostPost,
                payload: {postId, userId},
            })
        }
    }
    async addLike(postId: PostIdDTO, userId: TUserId): Promise<AddLikeRDO> {
        try {
            const{postId:id} = postId
            const _include = await this.postsPrisma.getIncludeParameters({})
            const _post = await this.postsPrisma.findOne(id, _include)
            if(
                !_post ||
                (_post as unknown as ReturnedPostRDO)[EPostDbEntityFields.postState] !== EPostState.published ||
                (_post as unknown as ReturnedPostRDO)[EPostDbEntityFields.likes].find((like) => `${like.authorId}` === `${userId}`)
            ) {
                throw new HttpException(ELoggerMessages.couldNotAddLike, HttpStatus.BAD_REQUEST)
            }
            const _like = await this.likesPrisma.prepareLike(id, userId)
            const newLikeId = await this.likesPrisma.save(_like) as TLikeId
            if(!newLikeId) {
                throw new HttpException(ELoggerMessages.alreadyExists, HttpStatus.BAD_GATEWAY)
            }
            return {[EId.id]: newLikeId}
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.couldNotAddLike,
                payload: {postId, userId},
            })
        }
    }
    async deleteLike(likeId: LikeIdDTO, userId: TUserId): Promise<DeleteLikeRDO> {
        try {
            const{likeId:id} = likeId
            const _where = await this.postsPrisma.getWhereParameters({[EPostDbEntityFields.userId]: `${userId}`}, false)
            const deleted = await this.likesPrisma.delete(id, _where)
            if(!deleted) {
                throw new HttpException(`${ELoggerMessages.couldNotDeleteLike} ${ELoggerMessages.notFound}`, HttpStatus.NO_CONTENT)
            }
            return {result: deleted}
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.couldNotDeleteLike,
                payload: {likeId, userId},
            })
        }
    }
    async addComment(data: CommentDTO, postId: PostIdDTO, userId: TUserId): Promise<AddCommentRDO> {
        try {
            const{postId:id} = postId
            const _post = await this.postsPrisma.findOne(id)
            if(!_post) {
                throw new HttpException(ELoggerMessages.couldNotAddComment, HttpStatus.BAD_REQUEST)
            }
            const{text:comment} = data
            const _comment = await this.commentsPrisma.prepareComment(comment, id, userId)
            const newCommentId = await this.commentsPrisma.save(_comment) as TCommentId
            return {[EId.id]: newCommentId}
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.couldNotAddComment,
                payload: {data, postId, userId},
            })
        }
    }
    async deleteComment(commentId: CommentIdDTO, userId: TUserId): Promise<DeleteCommentRDO> {
        try {
            const{commentId:id} = commentId
            const _where = await this.postsPrisma.getWhereParameters({[EPostDbEntityFields.userId]: `${userId}`}, false)
            const deleted = await this.commentsPrisma.delete(id, _where)
            if(!deleted) {
                throw new HttpException(`${ELoggerMessages.couldNotDeleteComment} or ${ELoggerMessages.notFound}`, HttpStatus.NO_CONTENT)
            }
            return {result: deleted}
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.couldNotDeleteComment,
                payload: {commentId, userId},
            })
        }
    }
}
