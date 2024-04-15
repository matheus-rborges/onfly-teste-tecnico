import { Inject, Injectable } from '@nestjs/common';

import { UsersRepository } from '../repositories/users.repository';
import { UserNotFoundException } from '../../errors';
import { User } from '../../interfaces';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
    constructor(
        @Inject(UsersRepository)
        private readonly usersRepository: UsersRepository,

        @Inject(AuthService)
        private readonly authService: AuthService
    ) {}

    async create(payload: User) {
        const password = this.authService.encodePassword(payload.password);

        return this.usersRepository.create({ ...payload, password });
    }

    async get(id: number) {
        if (!id) throw new UserNotFoundException({ id });

        const response = await this.usersRepository.get(id);

        if (!response) throw new UserNotFoundException({ id });

        return response;
    }

    async getByEmail(email: string) {
        if (!email) throw new UserNotFoundException({ email });

        const response = await this.usersRepository.getByEmail(email);

        if (!response) throw new UserNotFoundException({ email });

        return response;
    }
}
