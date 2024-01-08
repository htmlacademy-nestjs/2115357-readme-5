import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { EId } from "../entities/db.entity";

export type TLikeId = string

export class LikeIdDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly likeId: TLikeId;
}
export class AddLikeRDO {
    @ApiProperty()
    [EId.id]: TLikeId
}
export class DeleteLikeRDO {
    @ApiProperty()
    result: boolean
}
