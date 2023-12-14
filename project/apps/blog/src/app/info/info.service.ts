import { Injectable } from '@nestjs/common';
import { PaginationDTO, PostIdDTO, PostKeyphraseDTO, PostRepositoryService, PostTagDTO, PostTypeDTO, SortedPaginationDTO, UserIdDTO } from '@project/libraries/shared';
import { PostEntity } from 'libraries/shared/src/entities/post.entity';

@Injectable()
export class InfoService {
    constructor(private readonly postRepository: PostRepositoryService){}
    async findOnePost(postId: PostIdDTO): Promise<PostEntity | undefined> {
        const post = await this.postRepository.findOne(postId.postId)
        console.log(postId, post, 'findOnePost')
        return post
    }
    async listPosts(sortedPagination: SortedPaginationDTO): Promise<PostEntity[]> {
        const {offset, limit, sort} = sortedPagination
        const posts = await this.postRepository.findAll()
        console.log(offset, limit, sort)
        return posts
    }
    async listUserPosts(userId: UserIdDTO, sortedPagination: SortedPaginationDTO) {
        console.log(userId, sortedPagination, 'listUserPosts')
        return 'listed UserPosts'
    }
    async listUserDrafts() {
        console.log('listUserDrafts')
        return 'listed UserDrafts'
    }
    async listPostsByType(postType: PostTypeDTO) {
        console.log(postType, 'listPostsByType')
        return `listed PostsByType ${postType.postType}`
    }
    async listPostsByTag(postTag: PostTagDTO) {
        console.log(postTag, 'listPostsByTag')
        return `listed PostsByTag ${postTag.postTag}`
    }
    async listPostComments(postId: PostIdDTO, pagination: PaginationDTO) {
        console.log(postId, pagination, 'listPostComments')
        return 'listed PostComments'
    }
    async searchPosts(keyphrase: PostKeyphraseDTO) {
        console.log(keyphrase, 'searchPosts')
        return `searched Posts ${keyphrase.keyphrase}`
    }
}
