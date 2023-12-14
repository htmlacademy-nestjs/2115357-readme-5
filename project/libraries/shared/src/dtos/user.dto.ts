import type {} from "@nestjs/common";
import {
    IsString,
    MaxLength,
    MinLength,
    IsNotEmpty,
    IsOptional,
    Matches,
  } from 'class-validator';
import { ApiProperty, PickType} from '@nestjs/swagger';
import { appConfig } from "../configs/app.config";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";
import { EAllowedUploadedAvatarMimeTypes } from "../lib/file.validator";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { mongoUsersConfig } from "../configs/mongo-users.config";
import {Types} from 'mongoose'
import { EDbDates, EId } from "../entities/db.entity";
import { TTimeStampTypes } from "../services/time-stamp.service";

export type TUserId = '' | string | Types.ObjectId

const _appConfig = appConfig()
const _mongoUsersConfig = mongoUsersConfig()
const emailPattern = new RegExp('^[a-zA-Z]+?\.[a-zA-Z]+@[a-zA-Z-]+?\.[a-zA-Z]{2,8}$')

export enum EUserDTOFields {
    email = 'email',
    password = 'password',
    preparedAvatar = 'preparedAvatar'
}

@Schema()
export class UserDTO {
    @Prop()
    @ApiProperty()
    @Matches(emailPattern, {message: 'email should be an email'})
    readonly [EUserDTOFields.email]: string;

    @Prop()
    @ApiProperty()
    @IsString()
    @MinLength(+_appConfig.USER_NAME_MIN_LENGTH)
    @MaxLength(+_appConfig.USER_NAME_MAX_LENGTH)
    readonly fullName: string;

    @Prop()
    @ApiProperty({ type: 'string', minLength: +_appConfig.USER_PASSWORD_MIN_LENGTH, maxLength: +_appConfig.USER_PASSWORD_MAX_LENGTH, required: true })
    @IsString()
    @MinLength(+_appConfig.USER_PASSWORD_MIN_LENGTH)
    @MaxLength(+_appConfig.USER_PASSWORD_MAX_LENGTH)
    readonly [EUserDTOFields.password]: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsOptional()
    @IsFile()
    @MaxFileSize(+_appConfig.USER_AVATAR_MAX_FILE_SIZE)
    @HasMimeType(Object.values(EAllowedUploadedAvatarMimeTypes))
    readonly avatar?: MemoryStoredFile|undefined;
}

export class UserIdDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly userId: TUserId;
}

export class UserSignInDTO extends PickType(UserDTO, [EUserDTOFields.email] as const) {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly currentPassword: string;
}

export class UserUpdatePasswordDTO extends PickType(UserDTO, [EUserDTOFields.password] as const) {
    @ApiProperty({ type: 'string', minLength: +_appConfig.USER_PASSWORD_MIN_LENGTH, maxLength: +_appConfig.USER_PASSWORD_MAX_LENGTH, required: true })
    @IsString()
    @IsNotEmpty()
    readonly currentPassword: string;
}

declare interface SchemaOptions {
    pluralization: boolean;
    collection: string;
}
@Schema({ collection: _mongoUsersConfig.MONGO_USERS_DEFAULT_DB_NAME as string, pluralization: false, autoIndex: true, timestamps:true} as SchemaOptions)
export class UserDTOSchema extends UserDTO {
    @Prop()
    [EUserDTOFields.preparedAvatar]?: string
}
export const UserSchema = SchemaFactory.createForClass(UserDTOSchema)
UserSchema.index({[EUserDTOFields.email]: 1,}, {unique: true,});

export class ReturnedUserRDO {
    @ApiProperty({ type: 'string', required: true })
    [EId.id]: TUserId;

    @ApiProperty({ type: 'string', minLength: +_appConfig.USER_NAME_MIN_LENGTH, maxLength: +_appConfig.USER_NAME_MAX_LENGTH, required: true })
    fullName: string;

    @ApiProperty()
    avatar?: string;

    @ApiProperty()
    [EUserDTOFields.email]: string;

    @ApiProperty({ type: 'number|Date', required: true })
    [EDbDates.created_at]:TTimeStampTypes;

    @ApiProperty({ type: 'number|Date', required: true })
    [EDbDates.updated_at]:TTimeStampTypes;
}

export class AuthUserRDO {
    @ApiProperty({ type: 'string', required: true })
    [EId.id]: TUserId;
}

export class ChangeUserPasswordRDO {
    @ApiProperty({ type: 'boolean', required: true })
    result: boolean
}
