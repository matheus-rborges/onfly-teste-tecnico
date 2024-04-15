import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
import { LOGIN_PROPERTIES } from '../constants';

export class LoginDTO {
    @IsEmail()
    @ApiProperty(LOGIN_PROPERTIES.EMAIL)
    email: string;

    @IsString()
    @ApiProperty(LOGIN_PROPERTIES.PASSWORD)
    password: string;
}
