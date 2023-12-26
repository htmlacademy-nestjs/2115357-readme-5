import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { EId } from "../entities/db.entity";

export type TFeedId = string

export class FeedIdDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly feedId: TFeedId;
}
export class AddFeedRDO {
    @ApiProperty()
    [EId.id]: TFeedId
}
export class DeleteFeedRDO {
    @ApiProperty()
    result: boolean
}