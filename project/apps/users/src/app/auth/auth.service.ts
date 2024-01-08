import { HttpException, HttpStatus, Injectable} from '@nestjs/common'
import { UserEntity, AuthUserRDO, ELoggerMessages, EUserDTOFields, HashPasswordService, TUserId, UserDTO, UserMongoRepositoryService, UserSignInDTO, AppError, EId, EMongoId } from '@shared'

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserMongoRepositoryService,
        private readonly hashPasswordService: HashPasswordService
    ){}
    async signup(data: UserDTO): Promise<AuthUserRDO> {
        let user: UserEntity | null = null
        try {
            const password = await this.hashPasswordService.hash(data[EUserDTOFields.password])
            user = await this.userRepository.prepareUser({...data, [EUserDTOFields.password]: password})
        } catch(error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.signUpBadGateway,
                payload: data[EUserDTOFields.email],
            })
        }
        if(!user) {
            throw new HttpException(`${data[EUserDTOFields.email]} ${ELoggerMessages.userExists}`, HttpStatus.CONFLICT)
        }
        return {[EId.id]: await this.userRepository.save(user) as TUserId}
    }
    async signin(data: UserSignInDTO): Promise<AuthUserRDO> {
        let validated = false
        let user: UserEntity | null = null
        try {
            user = await this.userRepository.findByEmail(data[EUserDTOFields.email])
            validated = user ? await this.hashPasswordService.compare(data.currentPassword, user[EUserDTOFields.password]) : false
        } catch (error) {
            throw new AppError({
                error,
                responseMessage: ELoggerMessages.signInBadGateway,
                payload: data[EUserDTOFields.email],
            })
        }
        if(!validated) {
            throw new HttpException(ELoggerMessages.badCredentials, HttpStatus.UNAUTHORIZED)
        }
        return {[EId.id]: (user as UserEntity)[EMongoId._id] as TUserId}
    }
}
