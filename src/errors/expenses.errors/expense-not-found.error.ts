import { HttpException, HttpStatus } from '@nestjs/common';
import { GLOBAL_ERRORS } from '../../constants';

export class ExpenseNotFoundException extends HttpException {
    constructor(context: unknown) {
        super(
            { ...GLOBAL_ERRORS.EXPENSE_ERRORS.NOT_FOUND, query: context },
            HttpStatus.NOT_FOUND
        );
    }
}
