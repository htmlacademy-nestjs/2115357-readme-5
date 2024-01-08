import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export type TFeedId = string

export class FeedIdDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly feedId: TFeedId;
}
export class AddFeedRDO {
    @ApiProperty()
    result: boolean
}
export class DeleteFeedRDO {
    @ApiProperty()
    result: boolean
}
