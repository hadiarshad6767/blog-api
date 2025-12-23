
import { IsEmail, MinLength } from "class-validator";
export class CreateAuthDto {

    @IsEmail()
    email: string;
    @MinLength(6) 
    password: string;
}
