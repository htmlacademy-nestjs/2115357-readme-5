import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class JWTDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly jwt: string;
}