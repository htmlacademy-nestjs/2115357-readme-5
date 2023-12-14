import { Inject, Injectable } from "@nestjs/common/decorators";
import { ARepository } from "../lib/abstract-repository";
import { PostEntity } from "../entities/post.entity";
import { EPostDTOFields, PostDTO } from "../dtos/post.dto";
import { EId } from "../entities/db.entity";
import { Scope } from "@nestjs/common/interfaces";
import { ETimeStampTypes, TimeStampService } from "./time-stamp.service";

@Injectable({ scope: Scope.DEFAULT })
export class PostRepositoryService extends ARepository<PostEntity>{
    constructor(
        @Inject(TimeStampService) protected readonly timeStampService: TimeStampService<ETimeStampTypes.timestamp>) {
        super(timeStampService)
    }
    async preparePost(post: PostDTO): Promise<PostEntity> {
        const _post: {
            -readonly [k in keyof PostDTO]: PostDTO[keyof PostDTO]
        } & PostEntity = {
            [EId.id]: '',
            [EPostDTOFields.postType]: post[EPostDTOFields.postType],
        }
        for(const key of Object.keys(post)) {
            if(post[key as keyof PostDTO]) {
                //@ts-ignore
                _post[key as keyof PostDTO] = post[key as keyof PostDTO]
            }
        }
        return _post
    }
}