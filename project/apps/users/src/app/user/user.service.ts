import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChangeUserPasswordRDO, EUserDTOFields, HashPasswordService, ReturnedUserRDO, TUserId, UserIdDTO, UserMongoRepositoryService, UserUpdatePasswordDTO } from '@project/libraries/shared';
import { UserEntity } from 'libraries/shared/src/entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserMongoRepositoryService,
        private readonly hashPasswordService: HashPasswordService
    ){}
    async findOne(userId: UserIdDTO): Promise<ReturnedUserRDO> {
        const {userId: id} = userId
        const user = await this.userRepository.findOne(id)
        if(!user) {
            throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND)
        }
        return await this.userRepository.prepareReturnedUser(user as UserEntity)
    }
    async updatePassword(data: UserUpdatePasswordDTO, userId: TUserId): Promise<ChangeUserPasswordRDO> {
        const user = await this.userRepository.findOne(userId)
        if(!user) {
            throw new HttpException(`${userId} User not found`, HttpStatus.NOT_FOUND)
        }
        const validated = user ? await this.hashPasswordService.compare(data.currentPassword, (user as UserEntity)[EUserDTOFields.password]) : false
        if(!validated) {
            throw new HttpException('Bad credentials', HttpStatus.UNAUTHORIZED)
        }
        try {
            const updated = await this.userRepository.update(userId, {[EUserDTOFields.password]: await this.hashPasswordService.hash(data[EUserDTOFields.password])})
            return {result: updated}
        } catch(er) {
            console.log(er)
            throw new HttpException('Password was not changed', HttpStatus.BAD_GATEWAY)
        }
    }
}
