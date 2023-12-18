import { DbEntity, EDbDates, EId, EMongoId } from "../entities/db.entity";
import { TPostId } from "../dtos/post.dto";
import { TUserId } from "../dtos/user.dto";
import {randomUUID} from 'node:crypto'
import { TMongoReturnType } from "./abstract-mongo-repository";
import { ETimeStampTypes, TimeStampService } from "../services/time-stamp.service";

export type TId = TPostId|TUserId

export interface IRepository<T extends DbEntity<TId>> {
    timeStampType?: ETimeStampTypes;
    findAll({options, include, where}:{options?:any, include?:any, where?:any}): Promise<T[]>;
    findOne(id: T[EId.id]|T[EMongoId._id]): Promise<T|undefined> | Promise<TMongoReturnType<T>>;
    save(item: T): Promise<T[EId.id]|T[EMongoId._id]>;
    update(id: T[EId.id]|T[EMongoId._id], item: T): Promise<boolean>;
    delete(id: T[EId.id]|T[EMongoId._id]): Promise<boolean>;
}

export abstract class ARepository<T extends DbEntity<TId>> implements IRepository<T>{
    timeStampType: ETimeStampTypes;
    protected items: T[] = []
    constructor(
        protected readonly timeStampService: TimeStampService<ETimeStampTypes>
    ) {}
    async findAll(): Promise<T[]> {
        return this.items
    }
    async findOne(id: T[EId.id]): Promise<T | undefined> {
        return this.items.find((item) => item[EId.id] === id)
    }
    async save(item: T): Promise<T[EId.id]> {
        item[EId.id] = randomUUID()
        item[EDbDates.createdAt] = this.timeStampService.get(this.timeStampType)
        item[EDbDates.updatedAt] = item[EDbDates.createdAt]
        this.items.push(item)
        return item[EId.id]
    }
    async update(id: T[EId.id], item: T): Promise<boolean> {
        const previousItem = await this.findOne(id)
        if(!previousItem) {
            return false
        }
        const newItems = this.items.filter((item) => item[EId.id] !== id)
        item[EId.id] = id
        item[EDbDates.createdAt] = previousItem[EDbDates.createdAt]
        item[EDbDates.updatedAt] = this.timeStampService.get(this.timeStampType)
        newItems.push(item)
        this.items = [...newItems]
        return true
    }
    async delete(id: T[EId.id]): Promise<boolean> {
        if(!await this.findOne(id)) {
            return false
        }
        this.items = [...this.items.filter((item) => item[EId.id] !== id)]
        return true
    }
}