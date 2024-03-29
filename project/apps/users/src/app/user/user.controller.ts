import {Body, Controller} from '@nestjs/common'
import {ChangeUserPasswordRDO, EUsersRouts, ReturnedUserRDO, UserIdDTO, UserUpdatePasswordDTO, SubscribedToPostsRDO, SubscribeToPostsDTO, UsersIdsDTO} from '@shared'
import {UserService} from './user.service'
import {EventPattern} from '@nestjs/microservices'

@Controller()
export class UserController {
    constructor(private readonly userService: UserService){}

    //1.10
    @EventPattern(EUsersRouts.user)
    async findOne(@Body() userId: UserIdDTO): Promise<ReturnedUserRDO> {
        return await this.userService.findOne(userId)
    }

    //1.9
    @EventPattern(EUsersRouts.updatePassword)
    async updatePassword(@Body() data: UserUpdatePasswordDTO): Promise<ChangeUserPasswordRDO> {
        return await this.userService.updatePassword(data)
    }

    //7.5
    @EventPattern(EUsersRouts.subscribeToNewPostsNotifier)
    async subscribeToNewPostsNotifier(@Body() body: SubscribeToPostsDTO): Promise<SubscribedToPostsRDO> {
        const {interval, fullName, userId} = body
        return await this.userService.subscribeToNewPostsNotifier(userId, fullName, interval)
    }

    @EventPattern(EUsersRouts.hydrator)
    async hydrator(@Body() body: UsersIdsDTO) {
        const {usersIds} = body
        return await this.userService.hydrator(usersIds)
    }
}
