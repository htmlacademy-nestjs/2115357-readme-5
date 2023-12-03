import type {} from "@nestjs/common";
import { IsEnum, IsInt, IsOptional, IsPositive } from "class-validator";
import { Type } from "class-transformer";
import { EPostSortBy } from "./post.dto";
import { ApiProperty, PickType } from "@nestjs/swagger";

export enum EPaginationFields {
    offset = 'offset',
    limit = 'limit'
}

export class PaginationDTO {
    @ApiProperty({ type: 'number', required: false })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly [EPaginationFields.offset]?: number|undefined

    @ApiProperty({ type: 'number', required: false })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly [EPaginationFields.limit]?: number|undefined
}
export class SortedPaginationDTO extends PickType(PaginationDTO, [EPaginationFields.offset, EPaginationFields.limit] as const) {
    @ApiProperty()
    @IsOptional()
    @IsEnum(EPostSortBy)
    readonly sort?: EPostSortBy|undefined
}
