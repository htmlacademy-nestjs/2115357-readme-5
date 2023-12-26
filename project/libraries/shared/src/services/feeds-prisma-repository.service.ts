import { Injectable } from "@nestjs/common/decorators";
import { EDbDates, EId, EPrismaDbTables } from "../entities/db.entity";
import { ABlogPrismaRepository, EPrismaQueryFields } from "../lib/abstract-prisma-repository";
import { BlogPrismaService } from "./blog-prisma.service";
import { TUserId } from "../dtos/user.dto";
import { EFeedDbEntityFields } from "../entities/feed.entity";
import { TFeedId } from "../dtos/feed.dto";
import { SortedPaginationDTO } from "../dtos/pagination.dto";
import { EPostSortBy, ReturnedPostRDO } from "../dtos/post.dto";

export type TPrismaClientFeedsTable = BlogPrismaService[EPrismaDbTables.feeds]

export type TFeedEntity = {
    [EFeedDbEntityFields.ownerId]: TUserId;
    [EFeedDbEntityFields.donorId]: TUserId;
}

@Injectable()
export class FeedsPrismaRepositoryService extends ABlogPrismaRepository<TFeedEntity>{
    #rawClient:TPrismaClientFeedsTable
    constructor(
        protected readonly prismaClient: BlogPrismaService
    ) {
        super(prismaClient[EPrismaDbTables.feeds])
        this.#rawClient = prismaClient[EPrismaDbTables.feeds]
    }
    async prepareFeed(ownerId: TUserId, donorId: TUserId): Promise<TFeedEntity> {
        return {[EFeedDbEntityFields.ownerId]: ownerId, [EFeedDbEntityFields.donorId]: donorId}
    }
    async findFeed(ownerId: TUserId, donorId: TUserId): Promise<{[EId.id]:TFeedId}[]|undefined> {
        try {
            const _feed = await this.prismaClient.$queryRaw`
                SELECT f.id
                FROM feeds f
                WHERE 
                    f."ownerId" = ${ownerId} AND
                    f."donorId" = ${donorId}
            ;`
            return _feed as {[EId.id]:TFeedId}[]
        }catch(er) {
            console.log(er)
            return undefined
        }
    }
    async getUserFeed(ownerId: TUserId, sortedPagination: SortedPaginationDTO): Promise<ReturnedPostRDO[]|undefined> {
        const {limit, offset, sort} = sortedPagination
        const sortByDate = sort === EPostSortBy.date ? EPostSortBy.date : undefined
        const sortByComments = sort === EPostSortBy.comments ? EPostSortBy.comments : undefined
        const sortByLikes = sort === EPostSortBy.likes ? EPostSortBy.likes : undefined
        const sortBy = sortByDate || sortByComments || sortByLikes || EPostSortBy.date
        try {
            const _userFeed = await this.prismaClient.$queryRaw`
                SELECT
                    p.*,
                    json_agg(c.*) as comments,
                    json_agg(l.*) as likes
                FROM
                    posts p
                LEFT JOIN (select * from comments) AS c ON c."postId" = p."id"
                LEFT JOIN (select * from likes) AS l ON l."postId" = p."id"
                WHERE 
                    p."authorId" = ${ownerId} AND
                    p."state" = 'published'
                GROUP BY p."id"
                LIMIT ${limit} OFFSET ${offset}
            ;`
            const _donorsFeed = await this.prismaClient.$queryRaw`
                SELECT
                    p.*,
                    json_agg(c.*) as comments,
                    json_agg(l.*) as likes
                FROM posts p
                LEFT JOIN (select * from feeds) AS f ON f."ownerId" = ${ownerId}
                LEFT JOIN (select * from comments) AS c ON c."postId" = p."id"
                LEFT JOIN (select * from likes) AS l ON l."postId" = p."id"
                WHERE
                    p."authorId" = f."donorId" AND
                    p."state" = 'published'
                GROUP BY p."id"
                LIMIT ${limit} OFFSET ${offset}
            ;`
            const feed = await this.#feedSorter([..._userFeed as any[], ..._donorsFeed as any[]], sortBy) as ReturnedPostRDO[]
            return feed
        }catch(er) {
            console.log(er)
            return undefined
        }
    }
    async #feedSorter(feed: any[], sortBy: EPostSortBy): Promise<any[]> {
        const sorter = {
            [EPostSortBy.date]: function(feed: any[]): any[] {
                return feed.sort((a, b) => (a.publishedAt < b.publishedAt) ? 1 : ((b.publishedAt < a.publishedAt) ? -1 : 0))
            },
            [EPostSortBy.comments]: function(feed: any[]): any[] {
                return feed.sort((a, b) => (a.comments.length < b.comments.length) ? 1 : ((b.comments.length < a.comments.length) ? -1 : 0))
            },
            [EPostSortBy.likes]: function(feed: any[]): any[] {
                return feed.sort((a, b) => (a.likes.length < b.likes.length) ? 1 : ((b.likes.length < a.likes.length) ? -1 : 0))
            }
        }
        return sorter[sortBy](feed)
    }
}
