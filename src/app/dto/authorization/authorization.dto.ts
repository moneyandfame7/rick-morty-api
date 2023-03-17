import {ApiProperty} from '@nestjs/swagger'
import {IsEmail, MaxLength, MinLength} from 'class-validator'
import {Type} from 'class-transformer'

export class SignupDto {
    @ApiProperty({example: 'user@gmail.com', description: 'The email of the user.'})
    @IsEmail()
    public readonly email: string

    @ApiProperty({
        example: '123user123',
        description: 'The password of the user.'
    })
    @MinLength(8)
    @MaxLength(20)
    @Type(() => String)
    public readonly password: string
}

export class LoginDto {
    @IsEmail()
    public readonly email: string

    @Type(() => String)
    public readonly password: string;
}
