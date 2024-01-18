import { TCommentId } from "../dtos/comment.dto";
import { DbEntity, EId } from "./db.entity";

export class CommentEntity implements DbEntity<TCommentId>{
    [EId.id]: TCommentId;
}

export enum ECommentDbEntityFields {
    postId = 'postId',
    userId = 'authorId',
    comment = 'comment',
}
