import { Inject, Injectable } from '@nestjs/common';

import { ExpensesRepository } from '../repositories';
import { Expense, User } from '../../interfaces';
import { ExpenseNotFoundException } from '../../errors';
import { EmailService } from './email.service';
import { UserService } from './users.service';

@Injectable()
export class ExpensesService {
    constructor(
        @Inject(ExpensesRepository)
        private readonly expensesRepository: ExpensesRepository,

        @Inject(EmailService)
        private readonly emailService: EmailService,

        @Inject(UserService)
        private readonly userService: UserService
    ) {}

    async create(data: Expense) {
        const promises = [
            this.expensesRepository.create(data),
            this.userService.get(data.userId),
        ];
        const [expense, user] = await Promise.all(promises);

        const message = `Nova despesa cadastrada: ${
            data.description
        }: R$ ${data.value.toFixed(2)} `;
        const subject = 'Despesa cadastrada';

        await this.emailService.sendEmail(
            (user as User).email,
            message,
            subject
        );

        return expense as Expense;
    }

    async get(id: number, userId: number) {
        if (!+id) throw new ExpenseNotFoundException({ id, userId });

        const response = await this.expensesRepository.get(id, userId);

        if (!response) throw new ExpenseNotFoundException({ id, userId });

        return response;
    }

    async getByUser(userId: number) {
        const response = await this.expensesRepository.getByUser(userId);

        return response;
    }

    async delete(id: number, userId: number) {
        if (!+id || !+userId)
            throw new ExpenseNotFoundException({ id, userId });

        try {
            return await this.expensesRepository.delete(id, userId);
        } catch (error) {
            throw new ExpenseNotFoundException({ id, userId });
        }
    }

    async update(id: number, data: Expense) {
        if (!+id) throw new ExpenseNotFoundException({ id });

        try {
            return await this.expensesRepository.update({ id, ...data });
        } catch (error) {
            throw new ExpenseNotFoundException({ id, userId: data.userId });
        }
    }
}
