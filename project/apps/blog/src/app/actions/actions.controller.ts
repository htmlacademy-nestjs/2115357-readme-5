import {Body, Controller} from '@nestjs/common'
import {AddCommentRDO, AddLikeDTO, AddPostRDO, CommentDTO, DeleteCommentDTO, DeleteCommentRDO, DeleteLikeDTO, DeleteLikeRDO, DeletePostDTO, DeletePostRDO, EBlogRouts, PostDTO, RePostDTO, RePostRDO, RePublishPostDateDTO, UpdatePostDTO, UpdatePostRDO} from '@shared'
import {ActionsService} from './actions.service'
import {EventPattern} from '@nestjs/microservices'

@Controller()
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
    @EventPattern(EBlogRouts.post)
    async addPost(@Body() data: PostDTO): Promise<AddPostRDO> {
        return await this.actionsService.addPost(data)
    }

    @EventPattern(EBlogRouts.updatePost)
    async editPost(@Body() data: UpdatePostDTO): Promise<UpdatePostRDO> {
        return await this.actionsService.editPost(data)
    }

    @EventPattern(EBlogRouts.rePublish)
    async rePublishPost(@Body() data: RePublishPostDateDTO): Promise<UpdatePostRDO> {
        return await this.actionsService.rePublishPost(data)
    }

    @EventPattern(EBlogRouts.deletePost)
    async delete(@Body() data: DeletePostDTO): Promise<DeletePostRDO> {
        return await this.actionsService.deletePost(data)
    }

    //2.13
    @EventPattern(EBlogRouts.repost)
    async repost(@Body() data: RePostDTO): Promise<RePostRDO> {
        return await this.actionsService.repost(data)
    }

    /*
    5.1
    5.2
    -5.3
    */
    @EventPattern(EBlogRouts.like)
    async addLike(@Body() data: AddLikeDTO) {
        return await this.actionsService.addLike(data)
    }

    //-5.3
    @EventPattern(EBlogRouts.deleteLike)
    async deleteLike(@Body() data: DeleteLikeDTO): Promise<DeleteLikeRDO> {
        return await this.actionsService.deleteLike(data)
    }

    /*
    6.1
    6.2
    6.3
    */
    @EventPattern(EBlogRouts.comment)
    async addComment(@Body() data: CommentDTO): Promise<AddCommentRDO> {
        return await this.actionsService.addComment(data)
    }

    //6.4
    @EventPattern(EBlogRouts.deleteComment)
    async deleteComment(@Body() data: DeleteCommentDTO): Promise<DeleteCommentRDO> {
        return await this.actionsService.deleteComment(data)
    }
}
