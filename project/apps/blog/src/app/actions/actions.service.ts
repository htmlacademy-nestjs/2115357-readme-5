import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddCommentRDO, AddLikeRDO, AddPostRDO, CommentDTO, CommentIdDTO, DeleteCommentRDO, DeleteLikeRDO, DeletePostRDO, ELikeDbEntityFields, EPostDbEntityFields, EPostState, LikeIdDTO, PostDTO, PostIdDTO, PostsPrismaRepositoryService, RePostRDO, RePublishPostDateDTO, ReturnedPostRDO, TCommentId, TLikeId, TPostEntity, TPostId, TTagsConnectOrCreate, TUserId, UpdatePostDTO, UpdatePostRDO } from '@project/libraries/shared';
import { EId } from 'libraries/shared/src/entities/db.entity';
import { CommentsPrismaRepositoryService } from 'libraries/shared/src/services/comments-prisma-repository.service';
import { LikesPrismaRepositoryService } from 'libraries/shared/src/services/likes-prisma-repository.service';
import mongoose from 'mongoose';

@Injectable()
export class ActionsService {
    constructor(
        private readonly postsPrisma: PostsPrismaRepositoryService,
        private readonly likesPrisma: LikesPrismaRepositoryService,
        private readonly commentsPrisma: CommentsPrismaRepositoryService
        ){}
    async addPost(data: PostDTO, userId: TUserId): Promise<AddPostRDO> {
        if(!mongoose.isValidObjectId(userId)) {
            throw new HttpException(`Unauthorized add post request`, HttpStatus.UNAUTHORIZED)
        }
        const _post = await this.postsPrisma.preparePost(data, `${userId}`)
        const newPostId:TPostId = await this.postsPrisma.save(_post as Required<Pick<TPostEntity, EPostDbEntityFields.userId>> & TTagsConnectOrCreate & TPostEntity)
        if(!newPostId) {
            throw new HttpException(`BAD_GATEWAY on add post request`, HttpStatus.BAD_GATEWAY)
        }
        return {[EId.id]: newPostId}
    }
    async editPost(data: UpdatePostDTO, postId: PostIdDTO): Promise<UpdatePostRDO> {
        const{postId:id} = postId
        const _post = await this.postsPrisma.preparePost(data)
        const updated = await this.postsPrisma.update(id, _post)
        if(!updated) {
            throw new HttpException(`Post ${postId} was not updated`, HttpStatus.BAD_REQUEST)
        }
        return {result: updated}
    }
    async rePublishPost(data: RePublishPostDateDTO, postId: PostIdDTO): Promise<UpdatePostRDO> {
        const{postId:id} = postId
        const _post = await this.postsPrisma.prepareRepublishedPost(data)
        const updated = await this.postsPrisma.update(id, _post as TPostEntity)
        if(!updated) {
            throw new HttpException(`Publishing date for Post ${id} was not updated`, HttpStatus.BAD_REQUEST)
        }
        return {result: updated}
    }
    async deletePost(postId: PostIdDTO): Promise<DeletePostRDO> {
        const{postId:id} = postId
        const deleted = await this.postsPrisma.delete(id)
        if(!deleted) {
            throw new HttpException(`Post ${id} not found`, HttpStatus.NO_CONTENT)
        }
        return {result: deleted}
    }
    async repost(postId: PostIdDTO, userId: TUserId): Promise<RePostRDO> {
        if(!mongoose.isValidObjectId(userId)) {
            throw new HttpException(`Unauthorized repost request`, HttpStatus.UNAUTHORIZED)
        }
        const{postId:id} = postId
        const newRepostedPostId = await this.postsPrisma.repost(id, `${userId}`)
        if(newRepostedPostId === null) {
            throw new HttpException(`Post ${id} cannot be reposted`, HttpStatus.BAD_REQUEST)
        }
        if(newRepostedPostId === undefined) {
            throw new HttpException(`Post ${id} cannot be reposted`, HttpStatus.BAD_GATEWAY)
        }
        return {[EId.id]: newRepostedPostId}
    }
    async addLike(postId: PostIdDTO, userId: TUserId): Promise<AddLikeRDO> {
        const{postId:id} = postId
        const _include = await this.postsPrisma.getIncludeParameters({})
        const _post = await this.postsPrisma.findOne(id, _include)
        if(
            !_post ||
            (_post as unknown as ReturnedPostRDO)[EPostDbEntityFields.postState] !== EPostState.published ||
            (_post as unknown as ReturnedPostRDO)[EPostDbEntityFields.likes].find((like) => `${like.authorId}` === `${userId}`)
        ) {
            throw new HttpException(`Like for post ${id} by user ${userId} was not added`, HttpStatus.BAD_REQUEST)
        }
        const _like = await this.likesPrisma.prepareLike(id, userId)
        const newLikeId = await this.likesPrisma.save(_like) as TLikeId
        if(!newLikeId) {
            throw new HttpException(`Like for post ${id} by user ${userId} was not added`, HttpStatus.BAD_GATEWAY)
        }
        return {[EId.id]: newLikeId}
    }
    async deleteLike(likeId: LikeIdDTO): Promise<DeleteLikeRDO> {
        const{likeId:id} = likeId
        const deleted = await this.likesPrisma.delete(id)
        if(!deleted) {
            throw new HttpException(`Like ${id} not found`, HttpStatus.NO_CONTENT)
        }
        return {result: deleted}
    }
    async addComment(data: CommentDTO, postId: PostIdDTO, userId: TUserId): Promise<AddCommentRDO> {
        const{postId:id} = postId
        const _post = await this.postsPrisma.findOne(id)
        if(!_post) {
            throw new HttpException(`Comment for post ${id} by user ${userId} was not added`, HttpStatus.BAD_REQUEST)
        }
        const{text:comment} = data
        const _comment = await this.commentsPrisma.prepareComment(comment, id, userId)
        const newCommentId = await this.commentsPrisma.save(_comment) as TCommentId
        if(!newCommentId) {
            throw new HttpException(`Comment for post ${id} by user ${userId} was not added`, HttpStatus.BAD_GATEWAY)
        }
        return {[EId.id]: newCommentId}
    }
    async deleteComment(commentId: CommentIdDTO): Promise<DeleteCommentRDO> {
        const{commentId:id} = commentId
        const deleted = await this.commentsPrisma.delete(id)
        if(!deleted) {
            throw new HttpException(`Comment ${id} not found`, HttpStatus.NO_CONTENT)
        }
        return {result: deleted}
    }
}
