import { Injectable } from '@nestjs/common';
import { JWTDTO, UserIdDTO } from '@project/libraries/shared';

@Injectable()
export class JwtService {
    async issue(userId: UserIdDTO) {
        console.log(userId, 'issue')
        return 'issued'
    }
    async validate(jwt: JWTDTO) {
        console.log(jwt, 'validate')
        return `${jwt.jwt} validated`
    }
}
