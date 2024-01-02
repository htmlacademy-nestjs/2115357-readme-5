import { Injectable } from "@nestjs/common/decorators";
import { EId, EPrismaDbTables } from "../entities/db.entity";
import { ABlogPrismaRepository } from "../lib/abstract-prisma-repository";
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
        const orderBy = sortByDate || sortByComments || sortByLikes || EPostSortBy.date

        try {
            return await this.prismaClient.$queryRawUnsafe(`
                SELECT * FROM (
                    SELECT
                        p.*,
                        case when count(c) = 0 then '[]' else jsonb_agg(c.*) end as comments,
                        case when count(l) = 0 then '[]' else jsonb_agg(l.*) end as likes
                    FROM
                        posts p
                    LEFT JOIN (select * from comments) AS c ON c."postId" = p."id"
                    LEFT JOIN (select * from likes) AS l ON l."postId" = p."id"
                    WHERE 
                        p."authorId" = '${ownerId}' AND
                        p."state" = 'published'
                    GROUP BY p."id"

                    UNION

                    SELECT
                        p.*,
                        case when count(c) = 0 then '[]' else jsonb_agg(c.*) end as comments,
                        case when count(l) = 0 then '[]' else jsonb_agg(l.*) end as likes
                    FROM posts p
                    LEFT JOIN (select * from feeds) AS f ON f."ownerId" = '${ownerId}'
                    LEFT JOIN (select * from comments) AS c ON c."postId" = p."id"
                    LEFT JOIN (select * from likes) AS l ON l."postId" = p."id"
                    WHERE
                        p."authorId" = f."donorId" AND
                        p."state" = 'published'
                    GROUP BY p."id")

                ORDER BY "${orderBy}" desc
                LIMIT ${limit} OFFSET ${offset}
            ;`) as ReturnedPostRDO[]
        }catch(er) {
            console.log(er)
            return undefined
        }
    }
}
