import { TUserId } from "../dtos/user.dto";
import { envConfig } from "../configs/env.config";
import { EGatewayRouts } from "./routes";
import { JWTRDO } from "../dtos/jwt.dto";

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
    } catch(er) {
        console.log(er)
        return null
    }
}
export async function temporary__FunctionValidateCookiedJwt(token:string):Promise<object|undefined|null> {
    try {
        const validated = await fetch(`http://localhost:${_envConfig.GATEWAY_API_PORT}/${_envConfig.API_PREFIX}/${EGatewayRouts.jwt}/${EGatewayRouts.validate}/${token}`).then((res) => {
            try {
                return res.text()
            } catch(er) {
                return undefined
            }
        })
        return validated ? JSON.parse(validated) : undefined
    } catch(er) {
        console.log(er)
        return null
    }
}