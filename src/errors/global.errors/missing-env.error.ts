import { name } from '../../../package.json';
import { GLOBAL_ERRORS } from '../../constants';

export class MissingEnvsException extends Error {
    constructor(context: unknown) {
        super(
            JSON.stringify({
                context,
                code: GLOBAL_ERRORS.MISSING_ENVS_ERRORS.CODE,
                message: GLOBAL_ERRORS.MISSING_ENVS_ERRORS.MESSAGE,
                service: name,
            })
        );
    }
}
