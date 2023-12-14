import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ERouteParams, EUsersRouts, UserIdDTO, UserUpdatePasswordDTO } from '@project/libraries/shared';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'libraries/shared/src/entities/user.entity';

@ApiTags(EUsersRouts.user)
@Controller(EUsersRouts.user)
export class UserController {
    constructor(private readonly userService: UserService){}
    //1.10
    @Get(`/:${ERouteParams.userId}`)
    async findOne(@Param() userId: UserIdDTO): Promise<UserEntity | undefined> {
        return await this.userService.findOne(userId)
    }
    //1.9
    @Patch(`/:${ERouteParams.userId}`)
    async updatePassword(@Body() data: UserUpdatePasswordDTO, @Param() userId: UserIdDTO) {
        return await this.userService.updatePassword(data, userId)
    }
}
