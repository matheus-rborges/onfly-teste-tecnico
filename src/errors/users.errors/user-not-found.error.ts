import { HttpException, HttpStatus } from '@nestjs/common';
import { GLOBAL_ERRORS } from '../../constants';

export class UserNotFoundException extends HttpException {
    constructor(context: unknown) {
        super(
            { ...GLOBAL_ERRORS.USER_ERRORS.NOT_FOUND, query: context },
            HttpStatus.UNAUTHORIZED
        );
    }
}
