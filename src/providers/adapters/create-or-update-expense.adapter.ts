import { ExpenseDTO, UpdateExpenseDTO } from 'src/dtos';
import { BaseAdapter } from './base.adapter';
import { Expense } from 'src/interfaces';

export class CreateOrUpdateExpenseAdapter extends BaseAdapter<
    (ExpenseDTO | UpdateExpenseDTO) & { userId: number },
    Expense
> {
    constructor(expenseDTO: ExpenseDTO | UpdateExpenseDTO, userId: number) {
        super({ ...expenseDTO, userId });
    }

    parse(): Expense {
        return {
            userId: this.input.userId,
            description: this.input.description,
            value: this.input.value,
            date: this.input.date,
        };
    }
}
