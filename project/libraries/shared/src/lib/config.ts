import {registerAs} from '@nestjs/config'
import { convertToBytes } from './file.validator'

const config = registerAs('config', () => ({
    USER_NAME_MIN_LENGTH: +(process.env.USER_NAME_MIN_LENGTH as string),
    USER_NAME_MAX_LENGTH: +(process.env.USER_NAME_MAX_LENGTH as string),
    USER_AVATAR_MAX_FILE_SIZE: convertToBytes(+(process.env.USER_AVATAR_MAX_FILE_SIZE_IN_MB as string)),
    USER_PASSWORD_MIN_LENGTH: +(process.env.USER_PASSWORD_MIN_LENGTH as string),
    USER_PASSWORD_MAX_LENGTH: +(process.env.USER_PASSWORD_MAX_LENGTH as string),

    POST_TITLE_MIN_LENGTH: +(process.env.POST_TITLE_MIN_LENGTH as string),
    POST_TITLE_MAX_LENGTH: +(process.env.POST_TITLE_MAX_LENGTH as string),
    POST_PHOTO_MAX_FILE_SIZE: convertToBytes(+(process.env.POST_PHOTO_MAX_FILE_SIZE_IN_MB as string)),
    POST_SPOILER_MIN_LENGTH: +(process.env.POST_SPOILER_MIN_LENGTH as string),
    POST_SPOILER_MAX_LENGTH: +(process.env.POST_SPOILER_MAX_LENGTH as string),
    POST_TEXT_MIN_LENGTH: +(process.env.POST_TEXT_MIN_LENGTH as string),
    POST_TEXT_MAX_LENGTH: +(process.env.POST_TEXT_MAX_LENGTH as string),
    POST_CITATION_MIN_LENGTH: +(process.env.POST_CITATION_MIN_LENGTH as string),
    POST_CITATION_MAX_LENGTH: +(process.env.POST_CITATION_MAX_LENGTH as string),
    POST_CITATION_AUTHOR_MIN_LENGTH: +(process.env.POST_CITATION_AUTHOR_MIN_LENGTH as string),
    POST_CITATION_AUTHOR_MAX_LENGTH: +(process.env.POST_CITATION_AUTHOR_MAX_LENGTH as string),
    POST_LINK_DESCRIPTION_MIN_LENGTH: +(process.env.POST_LINK_DESCRIPTION_MIN_LENGTH as string),
    POST_LINK_DESCRIPTION_MAX_LENGTH: +(process.env.POST_LINK_DESCRIPTION_MAX_LENGTH as string),
    POST_TAG_MIN_LENGTH: +(process.env.POST_TAG_MIN_LENGTH as string),
    POST_TAG_MAX_LENGTH: +(process.env.POST_TAG_MAX_LENGTH as string),
    POST_MAX_TAGS_ALLOWED: +(process.env.POST_MAX_TAGS_ALLOWED as string),

    COMMENT_TEXT_MIN_LENGTH: +(process.env.COMMENT_TEXT_MIN_LENGTH as string),
    COMMENT_TEXT_MAX_LENGTH: +(process.env.COMMENT_TEXT_MAX_LENGTH as string),

    POSTS_LIST_DEFAULT_LIMIT: +(process.env.POSTS_LIST_DEFAULT_LIMIT as string),
    POSTS_LIST_DEFAULT_OFFSET: +(process.env.POSTS_LIST_DEFAULT_OFFSET as string),
}))

export {config}