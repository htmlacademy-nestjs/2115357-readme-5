import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommentsPaginationDTO, CommentsPrismaRepositoryService, ECommentDbEntityFields, EPostDbEntityFields, EPostState, PostIdDTO, PostKeyphraseDTO, PostTagDTO, PostTypeDTO, PostsPrismaRepositoryService, ReturnedCommentRDO, ReturnedPostRDO, SortedPaginationDTO, TUserId, UserIdDTO } from '@project/libraries/shared';
import { EPrismaDbTables } from 'libraries/shared/src/entities/db.entity';
import { EPrismaQueryFields } from 'libraries/shared/src/lib/abstract-prisma-repository';

@Injectable()
export class InfoService {
    constructor(
        private readonly postsPrisma: PostsPrismaRepositoryService,
        private readonly commentsPrisma: CommentsPrismaRepositoryService
    ){}
    async findOnePost(postId: PostIdDTO): Promise<ReturnedPostRDO> {
        const {postId:id} = postId
        const _include = await this.postsPrisma.getIncludeParameters({})
        const result = await this.postsPrisma.findOne(id, _include)
        if(!result) {
            throw new HttpException(`Post with id ${id} not found`, HttpStatus.NOT_FOUND)
        }
        return result as unknown as ReturnedPostRDO
    }
    async listPosts(sortedPagination: SortedPaginationDTO): Promise<ReturnedPostRDO[]> {
        const _includeParameters = await this.postsPrisma.getIncludeParameters({})
        const _sortedPaginationParameters = await this.postsPrisma.getSortedPaginationParameters(sortedPagination)
        const _whereParameters = await this.postsPrisma.getWhereParameters()
        return await this.postsPrisma.findAll({
            options: _sortedPaginationParameters,
            include: _includeParameters,
            where: _whereParameters,
        })
    }
    async listUserPosts(userId: UserIdDTO, sortedPagination: SortedPaginationDTO): Promise<ReturnedPostRDO[]> {
        const {userId:id} = userId
        const _includeParameters = await this.postsPrisma.getIncludeParameters({})
        const _sortedPaginationParameters = await this.postsPrisma.getSortedPaginationParameters(sortedPagination)
        const _whereParameters = await this.postsPrisma.getWhereParameters({
            [EPostDbEntityFields.userId]: id
        })
        return await this.postsPrisma.findAll({
            options: _sortedPaginationParameters,
            include: _includeParameters,
            where: _whereParameters,
        })
    }
    async listUserDrafts(userId: TUserId): Promise<ReturnedPostRDO[]> {
        const _includeParameters = await this.postsPrisma.getIncludeParameters({})
        const _whereParameters = await this.postsPrisma.getWhereParameters({
            [EPostDbEntityFields.userId]: `${userId}`,
            [EPostDbEntityFields.postState]: EPostState.draft
        }, false)
        return await this.postsPrisma.findAll({
            include: _includeParameters,
            where: _whereParameters,
        })
    }
    async listPostsByType(postType: PostTypeDTO): Promise<ReturnedPostRDO[]> {
        const{postType:type} = postType
        const _includeParameters = await this.postsPrisma.getIncludeParameters({})
        const _whereParameters = await this.postsPrisma.getWhereParameters({
            [EPostDbEntityFields.postType]: type
        })
        return await this.postsPrisma.findAll({
            include: _includeParameters,
            where: _whereParameters,
        })
    }
    async listPostsByTag(postTag: PostTagDTO): Promise<ReturnedPostRDO[]> {
        const{postTag:tag} = postTag
        const _includeParameters = await this.postsPrisma.getIncludeParameters({})
        const _whereParameters = await this.postsPrisma.getWhereParameters({
            [EPostDbEntityFields.tags]: {
                [EPrismaQueryFields.some]: {
                    [EPrismaQueryFields.name]: tag,
                },
            },
        })
        return await this.postsPrisma.findAll({
            include: _includeParameters,
            where: _whereParameters,
        })
    }
    async listPostComments(postId: PostIdDTO, pagination: CommentsPaginationDTO): Promise<ReturnedCommentRDO[]> {
        const {postId:id} = postId
        const _sortedPaginationParameters = await this.postsPrisma.getSortedPaginationParameters(pagination, true)
        const _whereParameters = await this.postsPrisma.getWhereParameters({
            [ECommentDbEntityFields.postId]: id,
            [EPrismaDbTables.posts]: {[EPrismaQueryFields.is]: {
                [EPostDbEntityFields.postState]: EPostState.published
            }
            },
        }, false)
        return await this.commentsPrisma.findAll({
            options: _sortedPaginationParameters,
            where: _whereParameters,
        })
    }
    async searchPosts(keyphrase: PostKeyphraseDTO): Promise<ReturnedPostRDO[]> {
        const{keyphrase:text} = keyphrase
        return await this.postsPrisma.fromJsonBodyTitleFieldRawSearchQuery({search: text})
    }
}
