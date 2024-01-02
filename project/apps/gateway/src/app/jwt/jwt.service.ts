import { Inject, Injectable } from '@nestjs/common';
import { JWTDTO, JWTRDO, UserIdDTO, jwtConfig as _jwtConfig} from '@project/libraries/shared';
import {JwtService as _JwtService} from '@nestjs/jwt'
import { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtService {
    constructor(
        private readonly jwtService: _JwtService,
        @Inject(_jwtConfig.KEY)
        private readonly jwtConfig: ConfigType<typeof _jwtConfig>,
    ){}
    async issue(data: UserIdDTO): Promise<JWTRDO> {
        const{userId} = data
        const [token, refreshToken] = await Promise.all([
            this.#issue(`${userId}`, +this.jwtConfig.JWT_TOKEN_TTL),
            this.#issue(`${userId}`, +this.jwtConfig.JWT_REFRESH_TOKEN_TTL),
        ])
        return {token, refreshToken}
    }
    async #issue(userId:string, expiresIn: number) {
        return await this.jwtService.signAsync(
            {
                sub: userId
            },
            {
                issuer: this.jwtConfig.JWT_ISSUER as string,
                secret: this.jwtConfig.JWT_TOKEN as string,
                expiresIn,
            }
        )
    }
    async validate(jwt: JWTDTO): Promise<object|undefined> {
        const{token} = jwt
        try {
            const verified = await this.jwtService.verifyAsync(token, {
                secret: this.jwtConfig.JWT_TOKEN as string,
            })
            return verified
        } catch(er) {
            return undefined
        }
    }
}
