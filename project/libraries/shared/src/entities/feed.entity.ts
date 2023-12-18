import { TFeedId } from "../dtos/feed.dto";
import { DbEntity, EId } from "./db.entity";

export class FeedEntity implements DbEntity<TFeedId>{
    [EId.id]: TFeedId;
}

export enum EFeedDbEntityFields {
    ownerId = 'ownerId',
    donorId = 'donorId',
}