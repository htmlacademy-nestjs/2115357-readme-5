import type {} from "@nestjs/common";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { appConfig } from "../configs/app.config";
import { EDbDates, EId } from "../entities/db.entity";
import { ECommentDbEntityFields } from "../entities/comment.entity";
import { TUserId } from "./user.dto";
import { TPostId } from "./post.dto";

export type TCommentId = string
const envConfig = appConfig()

export class CommentDTO {
    @ApiProperty()
    @IsString()
    @MinLength(+envConfig.COMMENT_TEXT_MIN_LENGTH)
    @MaxLength(+envConfig.COMMENT_TEXT_MAX_LENGTH)
    readonly text: string;
}

export class CommentIdDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly commentId: TCommentId;
}

export class AddCommentRDO {
    @ApiProperty()
    [EId.id]: TCommentId
}
export class DeleteCommentRDO {
    @ApiProperty()
    result: boolean
}

export class ReturnedCommentRDO {
    @ApiProperty({required: true})
    [EId.id]: TCommentId;
    @ApiProperty({required: true})
    [ECommentDbEntityFields.userId]: TUserId;
    @ApiProperty({required: true})
    [ECommentDbEntityFields.postId]: TPostId
    @ApiProperty({required: true})
    [ECommentDbEntityFields.comment]: string;
    @ApiProperty({required: true})
    [EDbDates.createdAt]: string;
    @ApiProperty({required: true})
    [EDbDates.updatedAt]: string;
}