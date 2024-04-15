import { User } from './user.interface';

export interface Expense {
    id?: number;
    description: string;
    userId: number;
    user?: User;
    value: number;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
