import * as users from '../../users.json';
import { UsersRepository } from '../providers/repositories';
import {
    Environment,
    UserService,
    AuthService,
    PrismaService,
} from '../providers';
import { User } from '../interfaces';

Environment.initialize();

export const chargeDatabase = async () => {
    const usersRepository = new UsersRepository(new PrismaService());
    const authService = new AuthService(usersRepository);
    const userService = new UserService(usersRepository, authService);

    for (const user of users.users) {
        await userService.create(user as User);
    }
};

chargeDatabase();
