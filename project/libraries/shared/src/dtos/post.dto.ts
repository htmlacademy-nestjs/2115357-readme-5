import type {} from "@nestjs/common"
import { ArrayMaxSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength, NotContains, Validate, ValidateIf } from "class-validator"
import { IsYoutubeLink } from "../lib/is-youtube-link.validator"
import { ApiProperty, PickType } from '@nestjs/swagger'
import { config } from "../lib/config";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data"
import { EAllowedUploadedPostPhotoMimeTypes } from "../lib/file.validator"
import { ERouteParams } from "../lib/route-params"
import { Transform } from "class-transformer"

export type TPostId = string

export enum EPostType {
    video = 'video',
    text = 'text',
    citation = 'citation',
    photo = 'photo',
    link = 'link'
}

export enum EPostSortBy {
    date = 'date',
    likes = 'likes',
    comments = 'comments',
}

export enum EPostDTOFields {
    postType = 'postType',
    tags = 'tags',
}

const envConfig = config()

export class PostDTO {
    @ApiProperty()
    @IsString()
    @IsEnum(EPostType)
    readonly [EPostDTOFields.postType]: EPostType

    @ApiProperty()
    @ValidateIf(_this => _this.postType === EPostType.video || _this.postType === EPostType.text)
    @IsString()
    @MinLength(envConfig.POST_TITLE_MIN_LENGTH)
    @MaxLength(envConfig.POST_TITLE_MAX_LENGTH)
    readonly title?: string;

    @ApiProperty()
    @ValidateIf(_this => _this.postType === EPostType.video)
    @IsUrl()
    @Validate(IsYoutubeLink)
    readonly youtubeVideoUrl?: string

    @ApiProperty()
    @ValidateIf(_this => _this.postType === EPostType.text)
    @IsString()
    @MinLength(envConfig.POST_SPOILER_MIN_LENGTH)
    @MaxLength(envConfig.POST_SPOILER_MAX_LENGTH)
    readonly spoiler?: string;

    @ApiProperty()
    @ValidateIf(_this => _this.postType === EPostType.text)
    @IsString()
    @MinLength(envConfig.POST_TEXT_MIN_LENGTH)
    @MaxLength(envConfig.POST_TEXT_MAX_LENGTH)
    readonly text?: string;

    @ApiProperty()
    @ValidateIf(_this => _this.postType === EPostType.citation)
    @IsString()
    @MinLength(envConfig.POST_CITATION_MIN_LENGTH)
    @MaxLength(envConfig.POST_CITATION_MAX_LENGTH)
    readonly citation?: string;

    @ApiProperty()
    @ValidateIf(_this => _this.postType === EPostType.citation)
    @IsString()
    @MinLength(envConfig.POST_CITATION_AUTHOR_MIN_LENGTH)
    @MaxLength(envConfig.POST_CITATION_AUTHOR_MAX_LENGTH)
    readonly citationAuthor?: string;

    @ApiProperty()
    @ValidateIf(_this => _this.postType === EPostType.link)
    @IsUrl()
    readonly link?: string

    @ApiProperty()
    @ValidateIf(_this => _this.postType === EPostType.link)
    @IsOptional()
    @IsString()
    @MinLength(envConfig.POST_LINK_DESCRIPTION_MIN_LENGTH)
    @MaxLength(envConfig.POST_LINK_DESCRIPTION_MAX_LENGTH)
    readonly linkDescription?: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @ValidateIf(_this => _this.postType === EPostType.photo)
    @IsFile()
    @MaxFileSize(envConfig.POST_PHOTO_MAX_FILE_SIZE)
    @HasMimeType(Object.values(EAllowedUploadedPostPhotoMimeTypes))
    readonly photo?: MemoryStoredFile;

    @ApiProperty({required: false })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.toString().split(',').map(String) : value)
    @IsArray()
    @ArrayMaxSize(envConfig.POST_MAX_TAGS_ALLOWED)
    @IsString({each: true})
    @NotContains(' ', {each: true})
    @NotContains('\\n', {each: true})
    @NotContains('\\r', {each: true})
    @NotContains('&nbsp;', {each: true})
    @MinLength(envConfig.POST_TAG_MIN_LENGTH, {
        each: true,
    })
    @MaxLength(envConfig.POST_TAG_MAX_LENGTH, {
        each: true,
    })
    readonly [EPostDTOFields.tags]?: string[]
}

export class PostIdDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly postId: TPostId;
}

export class UpdatePostDTO extends PostDTO {}

export class PostTypeDTO extends PickType(PostDTO, [EPostDTOFields.postType] as const) {}

export class PostTagDTO {
    @ApiProperty()
    @IsString()
    @MinLength(envConfig.POST_TAG_MIN_LENGTH)
    @MaxLength(envConfig.POST_TAG_MAX_LENGTH)
    @NotContains(' ')
    @NotContains('\\n')
    @NotContains('\\r')
    @NotContains('&nbsp;')
    readonly [ERouteParams.postTag]: string
}

export class PostKeyphraseDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly keyphrase: string;
}