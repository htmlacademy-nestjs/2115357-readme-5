import type {} from "@nestjs/common";
import {
    IsEmail,
    IsString,
    MaxLength,
    MinLength,
    IsNotEmpty,
    IsOptional,
  } from 'class-validator';
import { ApiProperty, PickType} from '@nestjs/swagger';
import { config } from "../lib/config";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";
import { EAllowedUploadedAvatarMimeTypes } from "../lib/file.validator";

export type TUserId = string

const envConfig = config()

export enum EUserDTOFields {
    email = 'email',
    password = 'password'
}

export class UserDTO {
    @ApiProperty()
    @IsEmail()
    readonly [EUserDTOFields.email]: string;

    @ApiProperty()
    @IsString()
    @MinLength(envConfig.USER_NAME_MIN_LENGTH)
    @MaxLength(envConfig.USER_NAME_MAX_LENGTH)
    readonly fullName: string;

    @ApiProperty()
    @IsString()
    @MinLength(envConfig.USER_PASSWORD_MIN_LENGTH)
    @MaxLength(envConfig.USER_PASSWORD_MAX_LENGTH)
    readonly [EUserDTOFields.password]: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsOptional()
    @IsFile()
    @MaxFileSize(envConfig.USER_AVATAR_MAX_FILE_SIZE)
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
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly currentPassword: string;
}
