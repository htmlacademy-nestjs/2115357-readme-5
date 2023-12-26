import { TLikeId } from "../dtos/like.dto";
import { DbEntity, EId } from "./db.entity";

export class LikeEntity implements DbEntity<TLikeId>{
    [EId.id]: TLikeId;
}

export enum ELikeDbEntityFields {
    postId = 'postId',
    userId = 'authorId',
}