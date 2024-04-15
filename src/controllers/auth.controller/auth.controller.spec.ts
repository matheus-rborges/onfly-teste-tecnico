import { fail } from 'assert';

import { PrismaService, AuthService, Environment } from '../../providers';
import { AuthController } from './auth.controller';
import { User } from '../../interfaces';
import { UsersRepository } from '../../providers/repositories';
import { UserNotFoundException } from '../../errors';
import * as mockUsers from '../../../users.json';
import { LoginDTO } from '../../dtos';

describe('ExpensesController', () => {
    let authController: AuthController;
    let authService: AuthService;
    const prismaService: PrismaService = new PrismaService();
    let usersRepository: UsersRepository;

    Environment.initialize();

    beforeEach(() => {
        usersRepository = new UsersRepository(prismaService);

        authService = new AuthService(usersRepository);
        authController = new AuthController(authService);
    });

    describe('login', () => {
        it('should return success when valid credentials are passed', async () => {
            const [userData] = mockUsers.users;
            const { password: userPassword, ...jwtPayload } = userData;

            jest.spyOn(usersRepository, 'getByEmail').mockImplementation(
                async (userEmail) =>
                    mockUsers.users.find(
                        ({ email }) => userEmail === email
                    ) as User
            );

            const encodePassword = jest.spyOn(authService, 'encodePassword');
            encodePassword.mockImplementation((password: string) => password);

            const generateJWT = jest.spyOn(authService, 'generateJWT');
            generateJWT.mockImplementation((payload) =>
                JSON.stringify(payload)
            );

            const payload: LoginDTO = {
                email: userData.email,
                password: userPassword,
            };

            const result = await authController.login(payload);

            expect(result).toEqual(
                expect.objectContaining({
                    user: jwtPayload,
                    token: JSON.stringify(jwtPayload),
                })
            );

            expect(encodePassword).toHaveBeenCalled();
            expect(generateJWT).toHaveBeenCalled();
        });

        it('should not return success when an invalid password is passed', async () => {
            const [userData] = mockUsers.users;

            jest.spyOn(usersRepository, 'getByEmail').mockImplementation(
                async (userEmail) =>
                    mockUsers.users.find(
                        ({ email }) => userEmail === email
                    ) as User
            );

            const encodePassword = jest.spyOn(authService, 'encodePassword');
            encodePassword.mockImplementation((password: string) => password);

            const generateJWT = jest.spyOn(authService, 'generateJWT');
            generateJWT.mockImplementation((payload) =>
                JSON.stringify(payload)
            );

            const payload: LoginDTO = {
                email: userData.email,
                password: 'worng password',
            };

            try {
                await authController.login(payload);
                fail('Expense not validated');
            } catch (error) {
                expect(error).toBeInstanceOf(UserNotFoundException);
            }
        });

        it('should not return success when an invalid password is passed', async () => {
            const [userData] = mockUsers.users;

            jest.spyOn(usersRepository, 'getByEmail').mockImplementation(
                async (userEmail) =>
                    mockUsers.users.find(
                        ({ email }) => userEmail === email
                    ) as User
            );

            const encodePassword = jest.spyOn(authService, 'encodePassword');
            encodePassword.mockImplementation((password: string) => password);

            const generateJWT = jest.spyOn(authService, 'generateJWT');
            generateJWT.mockImplementation((payload) =>
                JSON.stringify(payload)
            );

            const payload: LoginDTO = {
                email: 'wrong@teste.teste',
                password: userData.password,
            };

            try {
                await authController.login(payload);
                fail('Expense not validated');
            } catch (error) {
                expect(error).toBeInstanceOf(UserNotFoundException);
            }
        });
    });
});
