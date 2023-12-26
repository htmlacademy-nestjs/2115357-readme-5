import { Injectable } from "@nestjs/common/decorators";
import { EDbDates, EId, EPrismaDbTables } from "../entities/db.entity";
import { MemoryStoredFile } from "nestjs-form-data";
import {readFile} from 'node:fs/promises'
import { HttpException, HttpStatus } from "@nestjs/common";
import { ABlogPrismaRepository, EPrismaQueryFields, EPrismaSortedPaginationFields, ESortByOrder, TPrismaSortedPagination, TWhereParameters } from "../lib/abstract-prisma-repository";
import { BlogPrismaService } from "./blog-prisma.service";
import { EPostDTOFields, EPostDbEntityFields, EPostSortBy, EPostState, PostDTO, RePublishPostDateDTO, ReturnedPostRDO, TPostId } from "../dtos/post.dto";
import { Prisma, $Enums } from "@prisma-blog/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { TUserId } from "../dtos/user.dto";
import { EPaginationFields, SortedPaginationDTO } from "../dtos/pagination.dto";

export type TPrismaClientPostsTable = BlogPrismaService[EPrismaDbTables.posts]
export type TTagsConnectOrCreate = {
    [EPostDbEntityFields.tags]?: {connectOrCreate: {
        where: { name: string },
        create: { name: string },
    }[]}
}
export type TTagsDisconnect = {[EPostDbEntityFields.tags]?: {[EPrismaQueryFields.set]: []}}
export type TDbTags = {[EPostDbEntityFields.tags]: {id:string; [EPrismaQueryFields.name]:string}[]}
export type TPostEntity = {
    [EPostDbEntityFields.postType]: $Enums.EPostType;
    [EPostDbEntityFields.postBody]: Prisma.JsonObject;
    [EPostDbEntityFields.userId]?: string;
    [EDbDates.publishedAt]?: Date;
} & (TTagsConnectOrCreate|TTagsDisconnect)

export type TRepostedPost = {
    authorId: string;
    type: $Enums.EPostType;
    originalPostId: TPostId;
    originalAuthorId: TUserId;
    body: Prisma.JsonValue;
    tags: {connect: {id:string,name:string}[]};
}

@Injectable()
export class PostsPrismaRepositoryService extends ABlogPrismaRepository<TPostEntity>{
    #rawClient:TPrismaClientPostsTable
    constructor(
        protected readonly prismaClient: BlogPrismaService
    ) {
        super(prismaClient[EPrismaDbTables.posts])
        this.#rawClient = prismaClient[EPrismaDbTables.posts]
    }
    async preparePost(post: PostDTO, userId: string = ''): Promise<TPostEntity> {
        const _post:TPostEntity = {
            [EPostDbEntityFields.postType]: post[EPostDTOFields.postType],
            [EPostDbEntityFields.postBody]: {},
        }
        if(userId) {
            _post[EPostDbEntityFields.userId] = userId
        }
        if(post[EPostDTOFields.tags]) {
            _post[EPostDTOFields.tags] = {
                [EPrismaQueryFields.set]: userId ? undefined : [],
                [EPrismaQueryFields.connectOrCreate]: [...post[EPostDTOFields.tags].map((tag) => {
                    return {
                        [EPrismaQueryFields.where]: { [EPrismaQueryFields.name]: tag },
                        [EPrismaQueryFields.create]: { [EPrismaQueryFields.name]: tag },
                    }
                })
            ]}
        }
        if(!post[EPostDTOFields.tags]) {
            _post[EPostDTOFields.tags] = {[EPrismaQueryFields.set]: []}
        }
        const body = {} as TPostEntity[EPostDbEntityFields.postBody]
        for(const key of Object.keys(post)) {
            if(key === EPostDTOFields.postType || key === EPostDTOFields.tags) {
                continue
            }
            if(post[key as keyof PostDTO]) {
                if(key === EPostDTOFields.photo) {
                    body[key] = await this.#preparePhoto(post[key] as MemoryStoredFile)
                    continue
                }
                body[key] = post[key as keyof PostDTO] as JsonValue
            }
        }
        _post[EPostDbEntityFields.postBody] = {...body}
        return _post
    }
    async #preparePhoto(photo: MemoryStoredFile): Promise<string> {
        try {
            //@ts-ignore
            const _photo = await readFile(photo.path, 'base64')
            //@ts-ignore
            return `data:${photo.fileType.mime};base64,${_photo}`
        } catch(er) {
            console.log(er)
            throw new HttpException(`Photo cannot be uploaded`, HttpStatus.BAD_GATEWAY)
        }
    }
    async prepareRepublishedPost(data: RePublishPostDateDTO): Promise<Omit<TPostEntity, EPostDbEntityFields.postType|EPostDbEntityFields.postBody>> {
        const _post:Omit<TPostEntity, EPostDbEntityFields.postType|EPostDbEntityFields.postBody> = {
            [EDbDates.publishedAt]: data.publishedAt
        }
        return _post
    }
    async repost(postId: TPostId, userId: string): Promise<TPostId|null|undefined> {
        const originalPost = await this.prismaClientModel.findUnique({
            [EPrismaQueryFields.where]: {
                id: postId,
                rePosted: false
            },
            include: { tags: true }
        })
        if(!originalPost) {
            return null
        }
        const repostedPost:TRepostedPost = {
            authorId: userId,
            type: originalPost.type,
            originalPostId: originalPost[EId.id] as TPostId,
            originalAuthorId: originalPost.authorId as unknown as TUserId,
            body: originalPost.body,
            tags: {
                connect: originalPost.tags ?
                    (originalPost.tags as unknown as TDbTags[EPostDbEntityFields.tags])?.map((tag) => ({...tag})) :
                    []
            }
        }
        try {
            const [newRepostedPost, repostedOriginalPost] = await this.prismaClient.$transaction([
                this.#rawClient.create({
                    data: {
                        ...repostedPost as unknown as Required<Pick<TPostEntity, EPostDbEntityFields.userId>> & TTagsConnectOrCreate & TPostEntity,
                        ...{
                            [EDbDates.createdAt]: new Date(),
                            [EDbDates.updatedAt]: new Date()
                        }
                    }
                }),
                this.#rawClient.update({
                    [EPrismaQueryFields.where]: {
                        id: postId as string
                    },
                    [EPrismaQueryFields.data]: {rePosted: true}
                })
            ])
            return newRepostedPost?.id && repostedOriginalPost?.id === postId ? newRepostedPost.id : undefined
        } catch(er) {
            console.log(er)
            return undefined
        }
    }
    async getIncludeParameters({keys = [], all = true}: {keys?: EPrismaDbTables[]; all?: boolean}): Promise<Record<string, any>> {
        if(all) {
            return Object.keys(EPrismaDbTables).reduce((acc, dbTable) => (dbTable !== EPrismaDbTables.posts ? {...acc, [dbTable]:true} : acc), {})
        }
        return keys.reduce((acc, dbTable) => ({...acc, [dbTable]:true}), {})
    }
    async getSortedPaginationParameters(options: SortedPaginationDTO): Promise<TPrismaSortedPagination> {
        const _orderByLikes = options.sort === EPostSortBy.likes ? {
            [EPostSortBy.likes] : {
                [EPrismaQueryFields._count]: ESortByOrder.desc
            },
        } : undefined

        const _orderByComments = options.sort === EPostSortBy.comments ? {
            [EPostSortBy.comments]: {
                [EPrismaQueryFields._count]: ESortByOrder.desc
            },
        } : undefined
        const _orderByDate: {[EDbDates.publishedAt]: ESortByOrder}|undefined = options.sort === EPostSortBy.date ? {
            [EDbDates.publishedAt]: ESortByOrder.desc
        } : undefined
        return {
            [EPrismaSortedPaginationFields.skip]: options[EPaginationFields.offset] ?? undefined,
            [EPrismaSortedPaginationFields.take]: options[EPaginationFields.limit] ? options[EPaginationFields.limit] : undefined,
            [EPrismaSortedPaginationFields.orderBy]: _orderByLikes || _orderByComments || _orderByDate
        }
    }
    async getWhereParameters(parameters: Record<string, any> = {}, onlyPublished = true): Promise<TWhereParameters> {
        return {
            [EPrismaQueryFields.where]: {
                [EPostDbEntityFields.postState]: onlyPublished ? EPostState.published : undefined,
                ...parameters,
            }
        }
    }
    async fromJsonBodyTitleFieldRawSearchQuery({search}: {search: string}): Promise<ReturnedPostRDO[]> {
        const _search = `${search.replaceAll('  ', ' ').trim().split(' ').join('|')}:*`
        return await this.prismaClient.$queryRaw`
            SELECT p.*
            FROM posts p
            WHERE
            to_tsvector(body->'title') @@ to_tsquery(${_search}) AND
                p."state" = 'published'
            ORDER BY ts_rank(to_tsvector(body->'title'), to_tsquery(${_search})) DESC
            LIMIT 20
        ;`
    }
}