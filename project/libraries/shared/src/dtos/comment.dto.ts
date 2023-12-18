import type {} from "@nestjs/common";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { appConfig } from "../configs/app.config";

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