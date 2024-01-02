import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthUserRDO, EUserDTOFields, HashPasswordService, TUserId, UserDTO, UserMongoRepositoryService, UserSignInDTO } from '@project/libraries/shared';
import { EId, EMongoId } from 'libraries/shared/src/entities/db.entity';
import { UserEntity } from 'libraries/shared/src/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserMongoRepositoryService,
        private readonly hashPasswordService: HashPasswordService
    ){}
    async signup(data: UserDTO): Promise<AuthUserRDO> {
        const password = await this.hashPasswordService.hash(data[EUserDTOFields.password])
        const user = await this.userRepository.prepareUser({...data, [EUserDTOFields.password]: password})
        if(!user) {
            throw new HttpException(`${data[EUserDTOFields.email]} user exists`, HttpStatus.CONFLICT)
        }
        try {
            return {[EId.id]: await this.userRepository.save(user) as TUserId}
        } catch(er) {
            throw new HttpException('Db error or user exists', HttpStatus.BAD_GATEWAY)
        }
    }
    async signin(data: UserSignInDTO): Promise<AuthUserRDO> {
        const user = await this.userRepository.findByEmail(data[EUserDTOFields.email])
        const validated = user ? await this.hashPasswordService.compare(data.currentPassword, user[EUserDTOFields.password]) : false
        if(!validated) {
            throw new HttpException('Bad credentials', HttpStatus.UNAUTHORIZED)
        }
        return {[EId.id]: (user as UserEntity)[EMongoId._id] as TUserId}
    }
}
