import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EUserDTOFields, HashPasswordService, UserDTO, UserRepositoryService, UserSignInDTO } from '@project/libraries/shared';
import { UserEntity } from 'libraries/shared/src/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepositoryService,
        private readonly hashPasswordService: HashPasswordService
    ){}
    async signup(data: UserDTO): Promise<UserEntity> {
        const password = await this.hashPasswordService.hash(data[EUserDTOFields.password])
        const user = await this.userRepository.prepareUser({...data, [EUserDTOFields.password]: password})
        if(!user) {
            throw new HttpException(`${data[EUserDTOFields.email]} user exists`, HttpStatus.CONFLICT)
        }
        this.userRepository.save(user)
        return user
    }
    async signin(data: UserSignInDTO): Promise<UserEntity|undefined> {
        const user = await this.userRepository.findByEmail(data[EUserDTOFields.email])
        const validated = user ? await this.hashPasswordService.compare(data.currentPassword, user[EUserDTOFields.password]) : false
        return validated ? user : undefined
    }
}
