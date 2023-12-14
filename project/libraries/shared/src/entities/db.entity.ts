export enum EId {
    id = 'id',
}
export interface DbEntity<T> {
    [EId.id]: T
}