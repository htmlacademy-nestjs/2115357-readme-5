import { Injectable } from "@nestjs/common"

export enum ETimeStampTypes {
    timestamp = 'timestamp',
    object = 'object',
}
export type TTimeStampTypes = Date|number

@Injectable()
export  class TimeStampService<T extends ETimeStampTypes> {
    get(type: T):TTimeStampTypes {
        return type === ETimeStampTypes.timestamp ? Date.now() : new Date()
    }
}