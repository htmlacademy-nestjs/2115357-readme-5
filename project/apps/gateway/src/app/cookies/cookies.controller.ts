import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { EGatewayRouts, JWTDTO, jwtConfig as _jwtConfig} from '@project/libraries/shared';
import {Response, Request} from 'express'
import { ConfigType } from '@nestjs/config';
import { ApiExcludeController} from '@nestjs/swagger';

@ApiExcludeController()
@Controller(EGatewayRouts.cookies)
export class CookiesController {
    constructor(
        @Inject(_jwtConfig.KEY)
        private readonly jwtConfig: ConfigType<typeof _jwtConfig>
    ) {}
    @Post(`${EGatewayRouts.setCookies}`)
    async setCookies(@Req() request: Request, @Res({passthrough: true}) response: Response, @Body() jwt: JWTDTO): Promise<{result:boolean}> {
        const {token} = jwt
        if (request?.headers?.['authorization'] === this.jwtConfig.JWT_TOKEN) {
            response.cookie(`${this.jwtConfig.JWT_COOKIES_NAME}`, token, {
                sameSite: true,
                httpOnly: true,
                secure: true,
            })
            return {result:true}
        }
        return {result:false}
    }
}
