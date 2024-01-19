import {Body, Controller} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthUserRDO, EUsersRouts, UserDTO, UserSignInDTO, envConfig as _envConfig} from '@shared'
import {EventPattern} from '@nestjs/microservices'
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
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @EventPattern(EUsersRouts.signup)
    async signup(@Body() data: UserDTO): Promise<AuthUserRDO> {
        return await this.authService.signup(data)
    }

    @EventPattern(EUsersRouts.signin)
    async signin(@Body() data: UserSignInDTO): Promise<AuthUserRDO> {
        const userId = await this.authService.signin(data)
        return userId
    }
}
