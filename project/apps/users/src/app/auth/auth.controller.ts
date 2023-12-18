import { Body, Controller, HttpCode, HttpStatus, Post, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserRDO, EUsersRouts, TUserId, UserDTO, UserSignInDTO} from '@project/libraries/shared'
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    @Post(EUsersRouts.signup)
    @ApiResponse({status: HttpStatus.CONFLICT})
    @ApiResponse({status: HttpStatus.BAD_GATEWAY})
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({storage: FileSystemStoredFile})
    async signup(@Body() data: UserDTO): Promise<AuthUserRDO> {
        return await this.authService.signup(data)
    }
    @Post(EUsersRouts.signin)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.UNAUTHORIZED})
    async signin(@Body() data: UserSignInDTO): Promise<AuthUserRDO> {
        return await this.authService.signin(data)
    }
}
