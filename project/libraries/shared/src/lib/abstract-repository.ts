import { DbEntity, EId } from "../entities/db.entity";
import { TPostId } from "../dtos/post.dto";
import { TUserId } from "../dtos/user.dto";
import {randomUUID} from 'node:crypto'

type TId = TPostId|TUserId

export interface IRepository<T extends DbEntity<TId>> {
    findAll(): Promise<T[]>;
    findOne(id: T[EId.id]): Promise<T|undefined>;
    save(item: T): Promise<void>;
    update(id: T[EId.id], item: T): Promise<boolean>;
    delete(id: T[EId.id]): Promise<boolean>;
}

export abstract class ARepository<T extends DbEntity<TId>> implements IRepository<T>{
    constructor(protected items: T[] = []) {}
    async findAll(): Promise<T[]> {
        return this.items
    }
    async findOne(id: T[EId.id]): Promise<T | undefined> {
        return this.items.find((item) => item[EId.id] === id)
    }
    async save(item: T): Promise<void> {
        item[EId.id] = randomUUID()
        this.items.push(item)
    }
    async update(id: T[EId.id], item: T): Promise<boolean> {
        if(!await this.findOne(id)) {
            return false
        }
        const newItems = this.items.filter((item) => item[EId.id] !== id)
        item[EId.id] = id
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