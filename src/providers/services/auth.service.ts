import { Inject, Injectable } from '@nestjs/common';
import pbkdf2 from 'crypto-js/pbkdf2';
import jwt from 'jsonwebtoken';

import { UsersRepository } from '../repositories';
import { UserNotFoundException } from '../../errors';
import { Environment } from '../singletons';
import { JwtPayload } from '../../interfaces';
import { DAY_IN_SECONDS } from '../../constants';

@Injectable()
export class AuthService {
    private environment: Environment;

    constructor(
        @Inject(UsersRepository)
        private readonly usersRepository: UsersRepository
    ) {
        this.environment = Environment.getInstance();
    }

    async authenticate(
        email: string,
        password: string
    ): Promise<{ user: JwtPayload; token: string }> {
        if (!email) throw new UserNotFoundException({ email });

        const response = await this.usersRepository.getByEmail(email);

        if (!response) throw new UserNotFoundException({ email });

        const hashPassword = this.encodePassword(password);
        const { password: storedPassword, ...jwtPayload } = response;

        if (hashPassword !== storedPassword)
            throw new UserNotFoundException({ email });

        return {
            user: jwtPayload as JwtPayload,
            token: this.generateJWT(jwtPayload as JwtPayload),
        };
    }

    encodePassword(password: string): string {
        return pbkdf2(password, this.environment.PASSWORD_SALT).toString();
    }

    generateJWT(payload: JwtPayload): string {
        const exp = Math.floor(new Date().getTime() / 1000) + DAY_IN_SECONDS;
        return jwt.sign({ ...payload, exp }, this.environment.JWT_SECRET_KEY);
    }

    validateJWT(token: string): JwtPayload {
        return jwt.verify(token, this.environment.JWT_SECRET_KEY) as JwtPayload;
    }
}
