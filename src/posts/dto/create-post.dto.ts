import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()  
  title: string;
  @IsString()
  content: string;
  @Type(() => Number)
  @IsInt()
  authorId: number;
}
