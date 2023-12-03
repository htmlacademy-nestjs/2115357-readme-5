import { TUserId, UserDTO } from "../dtos/user.dto";
import { DbEntity, EId } from "./db.entity";

export class UserEntity extends UserDTO implements DbEntity<TUserId>{
    [EId.id]: TUserId;
}