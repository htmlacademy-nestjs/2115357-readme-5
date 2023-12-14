import { Injectable } from '@nestjs/common';
import { CommentDTO, CommentIdDTO, EPostDTOFields, EPostType, LikeIdDTO, PostDTO, PostIdDTO, PostRepositoryService, UpdatePostDTO } from '@project/libraries/shared';
import { PostEntity } from 'libraries/shared/src/entities/post.entity';

@Injectable()
export class ActionsService {
    constructor(private readonly postRepository: PostRepositoryService){}
    async addPost(data: PostDTO): Promise<PostEntity> {
        const post = await this.postRepository.preparePost(data)
        this.postRepository.save(post)
        console.log(post, 'added Post')
        return post
    }
    async editPost(data: UpdatePostDTO, postId: PostIdDTO) {
        console.log(data, postId, 'editPost')
        return `${EPostType[data[EPostDTOFields.postType]]} type post updated`
    }
    async deletePost(postId: PostIdDTO) {
        console.log(postId, 'deletePost')
        return 'deleted Post'
    }
    async repost(postId: PostIdDTO) {
        console.log(postId, 'repost')
        return 'reposted'
    }
    async addLike(postId: PostIdDTO) {
        console.log(postId, 'addLike')
        return 'added Like'
    }
    async deleteLike(likeId: LikeIdDTO) {
        console.log(likeId, 'addLike')
        return 'deleted Like'
    }
    async addComment(data: CommentDTO, postId: PostIdDTO) {
        console.log(data, postId, 'addComment')
        return 'added Comment'
    }
    async deleteComment(commentId: CommentIdDTO) {
        console.log(commentId, 'deleteComment')
        return 'deleted Comment'
    }
}
