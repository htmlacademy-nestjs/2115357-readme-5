import type {} from "@nestjs/common";
import { IsEnum, IsInt, IsOptional, IsPositive } from "class-validator";
import { Expose, Transform, Type } from "class-transformer";
import { EPostSortBy } from "./post.dto";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { appConfig } from "../configs/app.config";

export enum EPaginationFields {
    offset = 'offset',
    limit = 'limit'
}

const _appConfig = appConfig()

export class PaginationDTO {
    @ApiProperty({ type: 'number', required: false, default: +_appConfig.POSTS_LIST_DEFAULT_OFFSET})
    @Expose()
    @Transform((_this) => {
        return +_this.value % +_appConfig.POSTS_LIST_DEFAULT_LIMIT || !_this.value ? +_appConfig.POSTS_LIST_DEFAULT_OFFSET : Math.abs(+_this.value)
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    readonly [EPaginationFields.offset]?: number|undefined

    @ApiProperty({ type: 'number', required: false, default: +_appConfig.POSTS_LIST_DEFAULT_LIMIT})
    @Expose()
    @Transform((_this) => {
        const _offset = _this.obj[EPaginationFields.offset] ? +_this.obj[EPaginationFields.offset] : +_appConfig.POSTS_LIST_DEFAULT_OFFSET
        return _offset + (+_appConfig.POSTS_LIST_DEFAULT_LIMIT)
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly [EPaginationFields.limit]?: number|undefined
}
export class SortedPaginationDTO extends PickType(PaginationDTO, [EPaginationFields.offset, EPaginationFields.limit] as const) {
    @ApiProperty({required: false, default: EPostSortBy.date})
    @Expose()
    @Transform((_this) => {
        return _this.value === undefined ? EPostSortBy.date : _this.value
    })
    @IsOptional()
    @IsEnum(EPostSortBy)
    readonly sort?: EPostSortBy
}

export class CommentsPaginationDTO {
    @ApiProperty({ type: 'number', required: false, default: +_appConfig.COMMENTS_LIST_DEFAULT_OFFSET})
    @Expose()
    @Transform((_this) => {
        return +_this.value % +_appConfig.COMMENTS_LIST_DEFAULT_LIMIT || !_this.value ? +_appConfig.COMMENTS_LIST_DEFAULT_OFFSET : Math.abs(+_this.value)
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    readonly [EPaginationFields.offset]?: number|undefined

    @ApiProperty({ type: 'number', required: false, default: +_appConfig.COMMENTS_LIST_DEFAULT_LIMIT})
    @Expose()
    @Transform((_this) => {
        const _offset = _this.obj[EPaginationFields.offset] ? +_this.obj[EPaginationFields.offset] : +_appConfig.COMMENTS_LIST_DEFAULT_OFFSET
        return _offset + (+_appConfig.COMMENTS_LIST_DEFAULT_LIMIT)
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly [EPaginationFields.limit]?: number|undefined
}
