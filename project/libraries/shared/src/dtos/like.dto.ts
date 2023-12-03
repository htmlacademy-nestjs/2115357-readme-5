import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export type TLikeId = string

export class LikeIdDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly likeId: TLikeId;
}