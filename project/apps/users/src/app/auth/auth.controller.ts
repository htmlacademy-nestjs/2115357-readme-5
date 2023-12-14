import { Body, Controller, Post, } from '@nestjs/common';
import { AuthService } from './auth.service';
import {EUsersRouts, UserDTO, UserSignInDTO} from '@project/libraries/shared'
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'libraries/shared/src/entities/user.entity';

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
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({storage: FileSystemStoredFile})
    async signup(@Body() data: UserDTO): Promise<UserEntity> {
        return await this.authService.signup(data)
    }
    @Post(EUsersRouts.signin)
    async signin(@Body() data: UserSignInDTO): Promise<UserEntity|undefined> {
        return await this.authService.signin(data)
    }
}
