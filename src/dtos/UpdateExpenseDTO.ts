import { ApiProperty } from '@nestjs/swagger';
import {
    IsNumber,
    IsString,
    IsPositive,
    Length,
    IsDate,
    MaxDate,
    IsNotEmpty,
    IsOptional,
} from 'class-validator';
import { EXPENSE_PROPERTIES } from '../constants';
import { Transform } from 'class-transformer';

export class UpdateExpenseDTO {
    @IsString()
    @Length(1, 191)
    @IsOptional()
    @ApiProperty(EXPENSE_PROPERTIES.DESCRIPTION)
    description?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty(EXPENSE_PROPERTIES.VALUE)
    value?: number;

    @IsNotEmpty()
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MaxDate(new Date())
    @ApiProperty(EXPENSE_PROPERTIES.DATE)
    date?: Date;
}
