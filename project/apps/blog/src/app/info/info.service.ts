import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppError, CommentsPaginationDTO, CommentsPrismaRepositoryService, ECommentDbEntityFields, ELoggerMessages, EPostDbEntityFields, EPostState, EPrismaDbTables, EPrismaQueryFields, PostIdDTO, PostKeyphraseDTO, PostTagDTO, PostTypeDTO, PostsPrismaRepositoryService, ReturnedCommentRDO, ReturnedPostRDO, SortedPaginationDTO, TUserId, UserIdDTO } from '@shared';

@Injectable()
export class InfoService {
    constructor(
        private readonly postsPrisma: PostsPrismaRepositoryService,
        private readonly commentsPrisma: CommentsPrismaRepositoryService
    ){}
    async findOnePost(postId: PostIdDTO): Promise<ReturnedPostRDO> {
        try {
            const {postId:id} = postId
            const _include = await this.postsPrisma.getIncludeParameters({})
            const result = await this.postsPrisma.findOne(id, _include)
            if(!result) {
                throw new HttpException(ELoggerMessages.notFound, HttpStatus.NOT_FOUND)
            }
            return result as unknown as ReturnedPostRDO
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.badGateway,
                payload: {postId},
            })
        }
    }
    async listPosts(sortedPagination: SortedPaginationDTO): Promise<ReturnedPostRDO[]> {
        try {
            const _includeParameters = await this.postsPrisma.getIncludeParameters({})
            const _sortedPaginationParameters = await this.postsPrisma.getSortedPaginationParameters(sortedPagination)
            const _whereParameters = await this.postsPrisma.getWhereParameters()
            return await this.postsPrisma.findAll({
                options: _sortedPaginationParameters,
                include: _includeParameters,
                where: _whereParameters,
            })
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.badGateway,
                payload: {sortedPagination},
            })
        }
    }
    async listUserPosts(userId: UserIdDTO, sortedPagination: SortedPaginationDTO): Promise<ReturnedPostRDO[]> {
        try {
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
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.badGateway,
                payload: {userId, sortedPagination},
            })
        }
    }
    async listUserDrafts(userId: TUserId): Promise<ReturnedPostRDO[]> {
        try {
            const _includeParameters = await this.postsPrisma.getIncludeParameters({})
            const _whereParameters = await this.postsPrisma.getWhereParameters({
                [EPostDbEntityFields.userId]: `${userId}`,
                [EPostDbEntityFields.postState]: EPostState.draft
            }, false)
            return await this.postsPrisma.findAll({
                include: _includeParameters,
                where: _whereParameters,
            })
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.badGateway,
                payload: {userId},
            })
        }
    }
    async listPostsByType(postType: PostTypeDTO): Promise<ReturnedPostRDO[]> {
        try {
            const{postType:type} = postType
            const _includeParameters = await this.postsPrisma.getIncludeParameters({})
            const _whereParameters = await this.postsPrisma.getWhereParameters({
                [EPostDbEntityFields.postType]: type
            })
            return await this.postsPrisma.findAll({
                include: _includeParameters,
                where: _whereParameters,
            })
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.badGateway,
                payload: {postType},
            })
        }
    }
    async listPostsByTag(postTag: PostTagDTO): Promise<ReturnedPostRDO[]> {
        try {
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
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.badGateway,
                payload: {postTag},
            })
        }
    }
    async listPostComments(postId: PostIdDTO, pagination: CommentsPaginationDTO): Promise<ReturnedCommentRDO[]> {
        try {
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
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.badGateway,
                payload: {postId, pagination},
            })
        }
    }
    async searchPosts(keyphrase: PostKeyphraseDTO): Promise<ReturnedPostRDO[]> {
        try {
            const{keyphrase:text} = keyphrase
            return await this.postsPrisma.fromJsonBodyTitleFieldRawSearchQuery({search: text})
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.badGateway,
                payload: {keyphrase},
            })
        }
    }
}
