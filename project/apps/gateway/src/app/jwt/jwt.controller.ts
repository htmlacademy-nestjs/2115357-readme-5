import { Controller, Get, Param, Post } from '@nestjs/common';
import { EGatewayRouts, ERouteParams, JWTDTO, UserIdDTO } from '@project/libraries/shared';
import { JwtService } from './jwt.service';

@Controller(EGatewayRouts.jwt)
export class JwtController {
    constructor(private readonly jwtService: JwtService) {}
    //-1.8
    @Post(`${EGatewayRouts.issue}/:${ERouteParams.userId}`)
    async issue(@Param() userId: UserIdDTO) {
        return await this.jwtService.issue(userId)
    }
    //-1.8
    @Get(`${EGatewayRouts.validate}/:${ERouteParams.jwt}`)
    async validate(@Param() jwt: JWTDTO) {
        return await this.jwtService.validate(jwt)
    }
}
