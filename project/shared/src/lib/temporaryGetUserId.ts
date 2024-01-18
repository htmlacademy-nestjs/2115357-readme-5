import { ReturnedUserRDO, TUserId } from "../dtos/user.dto";
import { envConfig } from "../configs/env.config";
import { EGatewayRouts, EUsersRouts } from "./routes";
import { JWTRDO } from "../dtos/jwt.dto";
import {AppError} from '../logger/logger.interceptor';
import {ELoggerMessages} from '../logger/logger.enum';
import {guardError} from './auth.guard';

const _envConfig = envConfig()

export async function temporary__FunctionGetAuthorizedUserJwt(userId:TUserId):Promise<JWTRDO|null> {
    try {
        return await fetch(`http://localhost:${_envConfig.GATEWAY_API_PORT}/${_envConfig.API_PREFIX}/${EGatewayRouts.jwt}/${EGatewayRouts.issue}`, {
            method: 'POST',
            body: JSON.stringify({userId}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    } catch(error) {
        throw new AppError({error,
            responseMessage: ELoggerMessages.couldNotAuthorize,
            payload: {
                userId
            }
        })
    }
}
export async function temporary__FunctionValidateCookiedJwt(token:string):Promise<object|undefined> {
    try {
        const validated = await fetch(`http://localhost:${_envConfig.GATEWAY_API_PORT}/${_envConfig.API_PREFIX}/${EGatewayRouts.jwt}/${EGatewayRouts.validate}/${token}`).then((res) => {
            return res.text()
        })
        return validated ? JSON.parse(validated) : undefined
    } catch(error) {
        throw new AppError({error,
            responseMessage: guardError,
            payload: {
                token
            }
        })
    }
}

export async function temporary__FunctionGetAuthorizedUserNameForNotifier(userId: string): Promise<ReturnedUserRDO|null> {
    try {
        return await fetch(`http://localhost:${_envConfig.USERS_API_PORT}/${_envConfig.API_PREFIX}/${EUsersRouts.user}/${userId}`)
            .then((res) => res.json())
    } catch(error) {
        return null
    }
}
