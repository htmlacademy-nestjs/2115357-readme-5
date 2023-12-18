import { Injectable } from "@nestjs/common/decorators";
import { ARepository } from "../lib/abstract-repository";
import { UserEntity } from "../entities/user.entity";
import { EUserDTOFields, UserDTO } from "../dtos/user.dto";
import { Scope } from "@nestjs/common/interfaces";
import { ETimeStampTypes, TimeStampService } from "./time-stamp.service";
import { EDbDates } from "../entities/db.entity";

@Injectable({ scope: Scope.DEFAULT })
export class UserRepositoryService extends ARepository<UserEntity>{
    constructor(
        protected readonly timeStampService: TimeStampService<ETimeStampTypes.timestamp>
        ) {
        super(timeStampService)
    }
    async prepareUser(user: UserDTO): Promise<UserEntity | null> {
        if(await this.findByEmail(user[EUserDTOFields.email])) {
            return null
        }
        return {
            fullName: user.fullName,
            avatar: user.avatar,
            [EUserDTOFields.email]: user[EUserDTOFields.email],
            [EUserDTOFields.password]: user[EUserDTOFields.password]
        }
    }
    async findByEmail(email: string): Promise<UserEntity | undefined> {
        return this.items.find((item) => item[EUserDTOFields.email] === email)
    }
}