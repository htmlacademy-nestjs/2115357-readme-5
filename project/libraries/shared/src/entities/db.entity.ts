import { TTimeStampTypes } from "../services/time-stamp.service"

export enum EId {
    id = 'id',
}
export enum EMongoId {
    _id = '_id',
}

export enum EDbDates {
    created_at = 'createdAt',
    updated_at = 'updatedAt',
}
type TDbDates = {
    [k in EDbDates]?: TTimeStampTypes;
}
export type DbEntity<T> = {
    [k in EId.id | EMongoId._id]?: T;
} & TDbDates