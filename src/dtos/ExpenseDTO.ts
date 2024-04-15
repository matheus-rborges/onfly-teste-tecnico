import { ApiProperty } from '@nestjs/swagger';
import {
    IsNumber,
    IsString,
    IsPositive,
    Length,
    IsDate,
    MaxDate,
    IsNotEmpty,
} from 'class-validator';
import { EXPENSE_PROPERTIES } from '../constants';
import { Transform } from 'class-transformer';

export class ExpenseDTO {
    @IsString()
    @Length(1, 191)
    @ApiProperty(EXPENSE_PROPERTIES.DESCRIPTION)
    description: string;

    @IsNumber()
    @IsPositive()
    @ApiProperty(EXPENSE_PROPERTIES.VALUE)
    value: number;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MaxDate(new Date())
    @ApiProperty(EXPENSE_PROPERTIES.DATE)
    date: Date;
}
