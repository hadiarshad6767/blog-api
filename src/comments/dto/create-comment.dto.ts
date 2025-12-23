import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";
export class CreateCommentDto {
    @IsString()  
    content: string;
    @Type(() => Number)
    @IsInt()
    authorId: number;
    @Type(() => Number)
    @IsInt()
    postId: number;
}
 