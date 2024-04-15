import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common';
import express from 'express';
import { ApiTags } from '@nestjs/swagger';

import { ExpensesService } from '../../providers/services';
import { CreateOrUpdateExpenseAdapter } from '../../providers/adapters';
import { JwtPayload } from '../../interfaces';
import { AuthGuard } from '../../providers/guards';
import { ExpenseDTO, UpdateExpenseDTO } from '../../dtos';

@Controller('expenses')
@ApiTags('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) {}

    @Get('/')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async getByUser(
        @Request() request: express.Request & { user: JwtPayload }
    ) {
        const { user } = request;
        return this.expensesService.getByUser(user.id);
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async get(
        @Request() request: express.Request & { user: JwtPayload },
        @Param('id') id: number
    ) {
        const { user } = request;
        return this.expensesService.get(id, user.id);
    }

    @Post('/')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Request() request: express.Request & { user: JwtPayload },
        @Body() data: ExpenseDTO
    ) {
        const { user } = request;
        const adapter = new CreateOrUpdateExpenseAdapter(data, user.id);

        return this.expensesService.create(adapter.parse());
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async delete(
        @Request() request: express.Request & { user: JwtPayload },
        @Param('id') id: number
    ) {
        const { user } = request;
        return this.expensesService.delete(id, user.id);
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Request() request: express.Request & { user: JwtPayload },
        @Param('id') id: number,
        @Body() data: UpdateExpenseDTO
    ) {
        const { user } = request;
        const adapter = new CreateOrUpdateExpenseAdapter(data, user.id);

        return this.expensesService.update(id, adapter.parse());
    }
}
