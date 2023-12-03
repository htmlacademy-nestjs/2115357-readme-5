import { Injectable } from '@nestjs/common';
import { UserIdDTO, UserRepositoryService, UserUpdatePasswordDTO } from '@project/libraries/shared';
import { UserEntity } from 'libraries/shared/src/entities/user.entity';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepositoryService){}
    async findOne(userId: UserIdDTO): Promise<UserEntity | undefined> {
        const user = await this.userRepository.findOne(userId.userId)
        console.log(userId, user, 'foundOne')
        return user
    }
    async updatePassword(data: UserUpdatePasswordDTO, userId: UserIdDTO) {
        console.log(data, userId, 'updatePassword')
        return 'updatedPassword'
    }
}
