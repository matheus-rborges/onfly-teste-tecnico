import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../services/prisma.service';
import { Expense } from '../../interfaces';

@Injectable()
export class ExpensesRepository {
    constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

    async create(data: Expense): Promise<Expense> {
        return (await this.prismaService.expense.create({
            data: data as any,
        })) as Expense;
    }

    async get(id: number, userId: number): Promise<Expense> {
        return (await this.prismaService.expense.findUnique({
            where: { id, userId },
        })) as Expense;
    }

    async getByUser(userId: number): Promise<Array<Expense>> {
        return (await this.prismaService.expense.findMany({
            where: { userId },
        })) as Array<Expense>;
    }

    async update({ id, userId, ...data }: Expense): Promise<Expense> {
        return (await this.prismaService.expense.update({
            where: { id, userId },
            data: data as any,
        })) as Expense;
    }

    async delete(id: number, userId: number): Promise<Expense> {
        return (await this.prismaService.expense.delete({
            where: { id, userId },
        })) as Expense;
    }
}
