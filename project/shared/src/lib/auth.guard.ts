import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, SetMetadata, createParamDecorator } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EUsersRouts, jwtConfig, envConfig, temporary__FunctionValidateCookiedJwt, TUserId} from '@shared';
import {Request as _Request} from 'express'
import mongoose from 'mongoose';

const _jwtConfig = jwtConfig()
const _envConfig = envConfig()

export const guardError = `UNAUTHORIZED request. Sign in here: POST/ {protocol}://{host}${_envConfig.USERS_API_PORT ? `:${_envConfig.USERS_API_PORT}` : ''}/${_envConfig.API_PREFIX}/${EUsersRouts.auth}/${EUsersRouts.signin}`

export enum EGuardFields {
    public = 'public',
    userIdInRequest = 'user_id'
}

export type Request = {
    [EGuardFields.userIdInRequest]: TUserId
    'rawHeaders': any[]
} & _Request

@Injectable()
export class AuthGuardPassesUserIdToRequest implements CanActivate {
    constructor(private readonly reflector: Reflector){}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const isPublic = this.reflector.get(EGuardFields.public, context.getHandler())
        if(isPublic) {
            return true
        }
        const request = context.switchToHttp().getRequest<Request>()
        const {rawHeaders} = request
        const _cookies = (rawHeaders.find((header) => header.includes(`${_jwtConfig.JWT_COOKIES_NAME}`)) as string|undefined)?.split(';')
        if(!_cookies) {
            throw new HttpException(guardError, HttpStatus.UNAUTHORIZED)
        }
        const cookiedToken = _cookies.find((cookie) => cookie.includes(`${_jwtConfig.JWT_COOKIES_NAME}`))?.split('=').pop()
        const cookiedRefreshToken = _cookies.find((cookie) => cookie.includes(`${_jwtConfig.JWT_REFRESH_COOKIES_NAME}`))?.split('=').pop()

        const validated = cookiedToken ? await temporary__FunctionValidateCookiedJwt(cookiedToken) : undefined

        if(validated === undefined) {
            throw new HttpException(guardError, HttpStatus.UNAUTHORIZED)
        }
        const userId = (validated as {sub:string}).sub
        request[EGuardFields.userIdInRequest] = new mongoose.Types.ObjectId(userId)
        return true
    }
}

export const Public = () => SetMetadata(EGuardFields.public, true)

export const AuthorizedUserId = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<Request>()
        return request[EGuardFields.userIdInRequest]
    }
)
