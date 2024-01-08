import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EGatewayRouts, ERouteParams, JWTDTO, UserIdDTO } from '@shared';
import { JwtService } from './jwt.service';

@Controller(EGatewayRouts.jwt)
export class JwtController {
    constructor(private readonly jwtService: JwtService) {}
    //-1.8
    @Post(`${EGatewayRouts.issue}`)
    async issue(@Body() data: UserIdDTO) {
        return await this.jwtService.issue(data)
    }
    //-1.8
    @Get(`${EGatewayRouts.validate}/:${ERouteParams.token}`)
    async validate(@Param() token: JWTDTO): Promise<object|undefined> {
        return await this.jwtService.validate(token)
    }
}
