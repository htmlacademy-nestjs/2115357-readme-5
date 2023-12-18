import { Injectable } from "@nestjs/common/decorators";
import { UserEntity } from "../entities/user.entity";
import { EUserDTOFields, ReturnedUserRDO, TUserId, UserDTO } from "../dtos/user.dto";
import { Scope } from "@nestjs/common/interfaces";
import { AMongoRepository } from "../lib/abstract-mongo-repository";
import { UserDTOSchema } from "../dtos/user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { TTimeStampTypes} from "./time-stamp.service";
import { EDbDates, EId, EMongoId } from "../entities/db.entity";
import { MemoryStoredFile } from "nestjs-form-data";
import {readFile} from 'node:fs/promises'
import { HttpException, HttpStatus } from "@nestjs/common";

@Injectable({ scope: Scope.DEFAULT })
export class UserMongoRepositoryService extends AMongoRepository<UserEntity>{
    constructor(
        @InjectModel(UserDTOSchema.name) protected readonly itemSchema: Model<UserDTOSchema>
    ) {
        super(itemSchema)
    }
    async findByEmail(email: string): Promise<UserEntity | null> {
        return await this.itemSchema.findOne({email: email}).exec();
    }
    async prepareUser(user: UserDTO): Promise<UserEntity | null> {
        if(await this.findByEmail(user[EUserDTOFields.email])) {
            return null
        }
        const preparedUser:UserEntity = {
            /* [EMongoId._id]: '', */
            fullName: user.fullName,
            [EUserDTOFields.email]: user[EUserDTOFields.email],
            [EUserDTOFields.password]: user[EUserDTOFields.password]
        }
        if(user.avatar) {
            preparedUser[EUserDTOFields.preparedAvatar] = await this.#prepareAvatar(user.avatar)
        }
        return preparedUser
    }
    async #prepareAvatar(avatar: MemoryStoredFile): Promise<string> {
        try {
            //@ts-ignore
            const _avatar = await readFile(avatar.path, 'base64')
            //@ts-ignore
            return `data:${avatar.fileType.mime};base64,${_avatar}`
        } catch(er) {
            console.log(er)
            throw new HttpException(`Avatar cannot be uploaded`, HttpStatus.BAD_GATEWAY)
        }
    }
    async prepareReturnedUser(dbUser: UserEntity): Promise<ReturnedUserRDO> {
        const returnedUser:ReturnedUserRDO = {
            [EId.id]: dbUser[EMongoId._id] as TUserId,
            fullName: dbUser.fullName,
            [EUserDTOFields.email]: dbUser[EUserDTOFields.email],
            [EDbDates.created_at]: dbUser[EDbDates.created_at] as TTimeStampTypes,
            [EDbDates.updated_at]: dbUser[EDbDates.updated_at] as TTimeStampTypes,
        }
        if(dbUser[EUserDTOFields.preparedAvatar]) {
            returnedUser.avatar = dbUser[EUserDTOFields.preparedAvatar]
        }
        return returnedUser
    }
}