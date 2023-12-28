import { Body, Controller, Get, HttpStatus, Param, Patch} from '@nestjs/common';
import { ChangeUserPasswordRDO, ERouteParams, EUsersRouts, Public, ReturnedUserRDO, TUserId, UserIdDTO, UserUpdatePasswordDTO, AuthorizedUserId} from '@project/libraries/shared';
import { UserService } from './user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiParam, } from '@nestjs/swagger';

@ApiTags(EUsersRouts.user)
@Controller(EUsersRouts.user)
export class UserController {
    constructor(private readonly userService: UserService){}
    //1.10
    @Public()
    @Get(`/:${ERouteParams.userId}`)
    @ApiResponse({status: HttpStatus.NOT_FOUND})
    @ApiParam({ type: String, name: ERouteParams.userId, required: true })
    async findOne(@Param() userId: UserIdDTO): Promise<ReturnedUserRDO> {
        return await this.userService.findOne(userId)
    }
    //1.9
    @Patch(`/${EUsersRouts.updatePassword}`)
    @ApiResponse({status: HttpStatus.NOT_FOUND})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED})
    @ApiResponse({status: HttpStatus.BAD_GATEWAY})
    async updatePassword(@AuthorizedUserId() userId: TUserId, @Body() data: UserUpdatePasswordDTO): Promise<ChangeUserPasswordRDO> {
        return await this.userService.updatePassword(data, userId)
    }
}
