import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Res, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserRDO, ELoggerMessages, EUsersRouts, Public, UserDTO, UserSignInDTO, envConfig as _envConfig, jwtConfig, temporary__FunctionGetAuthorizedUserJwt} from '@shared'
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import {Response} from 'express'

/* 
1.1
1.2
1.3
1.4
1.5
1.6
1.7
-1.8
*/
@ApiTags(EUsersRouts.auth)
@Controller(EUsersRouts.auth)
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Public()
    @Post(EUsersRouts.signup)
    @ApiResponse({status: HttpStatus.CONFLICT})
    @ApiResponse({status: HttpStatus.BAD_GATEWAY})
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({storage: FileSystemStoredFile})
    async signup(@Body() data: UserDTO): Promise<AuthUserRDO> {
        return await this.authService.signup(data)
    }
    @Public()
    @Post(EUsersRouts.signin)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.UNAUTHORIZED})
    async signin(@Res({passthrough: true}) response: Response, @Body() data: UserSignInDTO): Promise<AuthUserRDO> {


            /* TO DO move to gateway/cookies */
            const _jwtConfig = jwtConfig()
            response.clearCookie(`${_jwtConfig.JWT_COOKIES_NAME}`)
            /* TO DO move to gateway/cookies */


        const userId = await this.authService.signin(data)


            /* TO DO move to gateway/cookies */
                const {token, refreshToken} = await temporary__FunctionGetAuthorizedUserJwt(userId.id) ?? {}
                if(!token) {
                    throw new HttpException(ELoggerMessages.couldNotAuthorize, HttpStatus.UNAUTHORIZED)
                }
                response.cookie(`${_jwtConfig.JWT_COOKIES_NAME}`, token, {
                    sameSite: true,
                    httpOnly: true,
                    secure: false,
                })
                response.cookie(`${_jwtConfig.JWT_REFRESH_COOKIES_NAME}`, refreshToken, {
                    sameSite: true,
                    httpOnly: true,
                    secure: false,
                })
            /* TO DO move to gateway/cookies */


        return userId
    }
}
