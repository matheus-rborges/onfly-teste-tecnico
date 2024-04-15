import express from 'express';
import { fail } from 'assert';

import {
    PrismaService,
    ExpensesService,
    EmailService,
    UserService,
    AuthService,
} from '../../providers';
import { ExpensesController } from './expenses.controller';
import { Expense, JwtPayload } from '../../interfaces';
import {
    ExpensesRepository,
    UsersRepository,
} from '../../providers/repositories';
import { ExpenseNotFoundException } from '../../errors';
import { ExpenseDTO } from '../../dtos';
import { AuthGuard } from '../../providers/guards';

describe('ExpensesController', () => {
    let expensesController: ExpensesController;
    let expenseService: ExpensesService;
    let emailService: EmailService;
    let userService: UserService;
    let authService: AuthService;
    const prismaService: PrismaService = new PrismaService();
    let expenseRepository: ExpensesRepository;
    let usersRepository: UsersRepository;

    const mockExpenses = [
        {
            id: 3,
            description: 'test',
            userId: 1,
            value: 4.24,
            date: new Date('2024-04-15T10:38:54.000Z'),
            createdAt: new Date('2024-04-13T17:07:02.850Z'),
            updatedAt: new Date('2024-04-13T17:07:02.850Z'),
        },
        {
            id: 4,
            description: 'test',
            userId: 2,
            value: 4.24,
            date: new Date('2024-04-15T10:38:54.000Z'),
            createdAt: new Date('2024-04-13T17:11:04.518Z'),
            updatedAt: new Date('2024-04-13T17:11:04.518Z'),
        },
        {
            id: 5,
            description: 'test',
            userId: 1,
            value: 4.24,
            date: new Date('2024-04-15T10:38:54.000Z'),
            createdAt: new Date('2024-04-13T17:42:35.779Z'),
            updatedAt: new Date('2024-04-13T17:42:35.779Z'),
        },
    ];

    beforeEach(() => {
        expenseRepository = new ExpensesRepository(prismaService);
        usersRepository = new UsersRepository(prismaService);

        authService = new AuthService(usersRepository);
        userService = new UserService(usersRepository, authService);
        emailService = new EmailService();
        expenseService = new ExpensesService(
            expenseRepository,
            emailService,
            userService
        );

        expensesController = new ExpensesController(expenseService);
    });

    describe('get', () => {
        it('should ensure the auth guard is applied to the get method', async () => {
            const guards = Reflect.getMetadata(
                '__guards__',
                ExpensesController.prototype.get
            );
            const guard = new guards[0]();

            expect(guard).toBeInstanceOf(AuthGuard);
        });

        it('should return success when a valid id is passed and the expense belongs to the user', async () => {
            const resultMock = {
                id: 3,
                description: 'test',
                userId: 1,
                value: 4.24,
                date: new Date('2024-04-15T10:38:54.000Z'),
                createdAt: new Date('2024-04-13T17:07:02.850Z'),
                updatedAt: new Date('2024-04-13T17:07:02.850Z'),
            };

            jest.spyOn(expenseRepository, 'get').mockImplementation(
                async () => resultMock
            );

            const user = {
                id: 1,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            expect(
                await expensesController.get(request, resultMock.id)
            ).toEqual(resultMock);
        });

        it('should not return success when a valid id is passed but the expense does not belong to the user', async () => {
            const resultMock = {
                id: 3,
                description: 'test',
                userId: 1,
                value: 4.24,
                date: new Date('2024-04-15T10:38:54.000Z'),
                createdAt: new Date('2024-04-13T17:07:02.850Z'),
                updatedAt: new Date('2024-04-13T17:07:02.850Z'),
            };

            jest.spyOn(expenseRepository, 'get').mockImplementation(
                async (_: number, userId: number) =>
                    userId === resultMock.userId ? resultMock : null
            );

            const user = {
                id: 2,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            try {
                await expensesController.get(request, resultMock.id);
                fail('Expense not validated');
            } catch (error) {
                expect(error).toBeInstanceOf(ExpenseNotFoundException);
            }
        });

        it('should not return success when an invalid id is passed', async () => {
            jest.spyOn(expenseRepository, 'get').mockImplementation(
                async () => null
            );

            const user = {
                id: 2,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            try {
                await expensesController.get(request, 5);
                fail('Expense not validated');
            } catch (error) {
                expect(error).toBeInstanceOf(ExpenseNotFoundException);
            }
        });
    });

    describe('getByUser', () => {
        it('should ensure the auth guard is applied to the getByUser method', async () => {
            const guards = Reflect.getMetadata(
                '__guards__',
                ExpensesController.prototype.getByUser
            );
            const guard = new guards[0]();

            expect(guard).toBeInstanceOf(AuthGuard);
        });

        it('should return all the expenses that belongs to the user', async () => {
            const user = {
                id: 1,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            const result = mockExpenses.filter(
                ({ userId }) => userId === user.id
            );

            jest.spyOn(expenseRepository, 'getByUser').mockImplementation(
                async (id) => mockExpenses.filter(({ userId }) => userId === id)
            );

            expect(await expensesController.getByUser(request)).toEqual(result);
        });

        it('should return an empty array when the user has no expenses (does not throw error)', async () => {
            const user = {
                id: 5,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            const result = [];

            jest.spyOn(expenseRepository, 'getByUser').mockImplementation(
                async (id) => mockExpenses.filter(({ userId }) => userId === id)
            );

            expect(await expensesController.getByUser(request)).toEqual(result);
        });
    });

    describe('create', () => {
        it('should ensure the auth guard is applied to the create method', async () => {
            const guards = Reflect.getMetadata(
                '__guards__',
                ExpensesController.prototype.create
            );
            const guard = new guards[0]();

            expect(guard).toBeInstanceOf(AuthGuard);
        });

        it('should return success and send and email when a valid payload is passed', async () => {
            const payload = {
                description: 'test',
                value: 10,
                date: new Date(),
            } as ExpenseDTO;

            jest.spyOn(expenseRepository, 'create').mockImplementation(
                async (data: Expense) => data
            );

            const sendEmail = jest.spyOn(emailService, 'sendEmail');
            sendEmail.mockImplementation(() => null);

            const user = {
                id: 1,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            const result = await expensesController.create(request, payload);

            expect(result).toEqual(
                expect.objectContaining({ ...payload, userId: user.id })
            );
            expect(sendEmail).toHaveBeenCalledTimes(1);
        });
    });

    describe('update', () => {
        it('should ensure the auth guard is applied to the update method', async () => {
            const guards = Reflect.getMetadata(
                '__guards__',
                ExpensesController.prototype.update
            );
            const guard = new guards[0]();

            expect(guard).toBeInstanceOf(AuthGuard);
        });

        it('should return success when trying to update description for a expense that belongs to the user', async () => {
            const expense = {
                id: 3,
                description: 'test',
                userId: 1,
                value: 4.24,
                date: new Date('2024-04-15T10:38:54.000Z'),
                createdAt: new Date('2024-04-13T17:07:02.850Z'),
                updatedAt: new Date('2024-04-13T17:07:02.850Z'),
            };

            const payload = {
                description: 'test',
            };

            jest.spyOn(expenseRepository, 'update').mockImplementation(
                async (data) => ({
                    ...expense,
                    ...data,
                })
            );

            const user = {
                id: 1,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            expect(
                await expensesController.update(request, 3, payload)
            ).toEqual(expect.objectContaining({ ...payload, userId: user.id }));
        });

        it('should return success when trying to update value for a expense that belongs to the user', async () => {
            const expense = {
                id: 3,
                description: 'test',
                userId: 1,
                value: 4.24,
                date: new Date('2024-04-15T10:38:54.000Z'),
                createdAt: new Date('2024-04-13T17:07:02.850Z'),
                updatedAt: new Date('2024-04-13T17:07:02.850Z'),
            };

            const payload = {
                value: 10,
            };

            jest.spyOn(expenseRepository, 'update').mockImplementation(
                async (data) => ({
                    ...expense,
                    ...data,
                })
            );

            const user = {
                id: 1,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            expect(
                await expensesController.update(request, 3, payload)
            ).toEqual(expect.objectContaining({ ...payload, userId: user.id }));
        });

        it('should return success when trying to update date for a expense that belongs to the user', async () => {
            const expense = {
                id: 3,
                description: 'test',
                userId: 1,
                value: 4.24,
                date: new Date('2024-04-15T10:38:54.000Z'),
                createdAt: new Date('2024-04-13T17:07:02.850Z'),
                updatedAt: new Date('2024-04-13T17:07:02.850Z'),
            };

            const payload = {
                date: new Date(),
            };

            jest.spyOn(expenseRepository, 'update').mockImplementation(
                async (data) => ({
                    ...expense,
                    ...data,
                })
            );

            const user = {
                id: 1,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            expect(
                await expensesController.update(request, 3, payload)
            ).toEqual(expect.objectContaining({ ...payload, userId: user.id }));
        });

        it('should return success when trying all attributes for a expense that belongs to the user', async () => {
            const expense = {
                id: 3,
                description: 'test',
                userId: 1,
                value: 4.24,
                date: new Date('2024-04-15T10:38:54.000Z'),
                createdAt: new Date('2024-04-13T17:07:02.850Z'),
                updatedAt: new Date('2024-04-13T17:07:02.850Z'),
            };

            const payload = {
                value: 10,
                date: new Date(),
                description: 'test',
            };

            jest.spyOn(expenseRepository, 'update').mockImplementation(
                async (data) => ({
                    ...expense,
                    ...data,
                })
            );

            const user = {
                id: 1,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            expect(
                await expensesController.update(request, 3, payload)
            ).toEqual(expect.objectContaining({ ...payload, userId: user.id }));
        });

        it('should not return success when an valid payload is passed but the expense does not belong to the user', async () => {
            const expense = {
                id: 3,
                description: 'test',
                userId: 1,
                value: 4.24,
                date: new Date('2024-04-15T10:38:54.000Z'),
                createdAt: new Date('2024-04-13T17:07:02.850Z'),
                updatedAt: new Date('2024-04-13T17:07:02.850Z'),
            };

            const payload = {
                value: 10,
                date: new Date(),
                description: 'test',
            };

            jest.spyOn(expenseRepository, 'update').mockImplementation(
                async ({ id, userId }) => {
                    if (id !== expense.id || userId !== expense.userId) {
                        throw new Error();
                    }
                    return expense;
                }
            );

            const user = {
                id: 3,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            try {
                await expensesController.update(request, 3, payload);
                fail('Expense not validated');
            } catch (error) {
                expect(error).toBeInstanceOf(ExpenseNotFoundException);
            }
        });

        it('should not return success when an valid payload is passed but an invalid id is passed', async () => {
            const expense = {
                id: 3,
                description: 'test',
                userId: 1,
                value: 4.24,
                date: new Date('2024-04-15T10:38:54.000Z'),
                createdAt: new Date('2024-04-13T17:07:02.850Z'),
                updatedAt: new Date('2024-04-13T17:07:02.850Z'),
            };

            const payload = {
                value: 10,
                date: new Date(),
                description: 'test',
            };

            jest.spyOn(expenseRepository, 'update').mockImplementation(
                async ({ id, userId }) => {
                    if (id !== expense.id || userId !== expense.userId) {
                        throw new Error();
                    }
                    return expense;
                }
            );

            const user = {
                id: 1,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            try {
                await expensesController.update(request, 5, payload);
                fail('Expense not validated');
            } catch (error) {
                expect(error).toBeInstanceOf(ExpenseNotFoundException);
            }
        });
    });

    describe('delete', () => {
        it('should ensure the auth guard is applied to the delete method', async () => {
            const guards = Reflect.getMetadata(
                '__guards__',
                ExpensesController.prototype.delete
            );
            const guard = new guards[0]();

            expect(guard).toBeInstanceOf(AuthGuard);
        });

        it('should return success when a valid id is passed and the expense belongs to the user', async () => {
            const resultMock = {
                id: 3,
                description: 'test',
                userId: 1,
                value: 4.24,
                date: new Date('2024-04-15T10:38:54.000Z'),
                createdAt: new Date('2024-04-13T17:07:02.850Z'),
                updatedAt: new Date('2024-04-13T17:07:02.850Z'),
            };

            jest.spyOn(expenseRepository, 'delete').mockImplementation(
                async (id, userId) => {
                    if (id !== resultMock.id || userId !== resultMock.userId)
                        throw new Error();
                    return resultMock;
                }
            );

            const user = {
                id: 1,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            expect(
                await expensesController.delete(request, resultMock.id)
            ).toEqual(resultMock);
        });

        it('should not return success when a valid id is passed but the expense does not belong to the user', async () => {
            const resultMock = {
                id: 3,
                description: 'test',
                userId: 1,
                value: 4.24,
                date: new Date('2024-04-15T10:38:54.000Z'),
                createdAt: new Date('2024-04-13T17:07:02.850Z'),
                updatedAt: new Date('2024-04-13T17:07:02.850Z'),
            };

            jest.spyOn(expenseRepository, 'delete').mockImplementation(
                async (id, userId) => {
                    if (id !== resultMock.id || userId !== resultMock.userId)
                        throw new Error();
                    return resultMock;
                }
            );

            const user = {
                id: 2,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            try {
                await expensesController.delete(request, resultMock.id);
                fail('Expense not validated');
            } catch (error) {
                expect(error).toBeInstanceOf(ExpenseNotFoundException);
            }
        });

        it('should not return success when an invalid id is passed', async () => {
            const resultMock = {
                id: 3,
                description: 'test',
                userId: 1,
                value: 4.24,
                date: new Date('2024-04-15T10:38:54.000Z'),
                createdAt: new Date('2024-04-13T17:07:02.850Z'),
                updatedAt: new Date('2024-04-13T17:07:02.850Z'),
            };

            jest.spyOn(expenseRepository, 'delete').mockImplementation(
                async (id, userId) => {
                    if (id !== resultMock.id || userId !== resultMock.userId)
                        throw new Error();
                    return resultMock;
                }
            );

            const user = {
                id: 1,
            } as JwtPayload;

            const request = { user } as unknown as express.Request & {
                user: JwtPayload;
            };

            try {
                await expensesController.delete(request, 10);
                fail('Expense not validated');
            } catch (error) {
                expect(error).toBeInstanceOf(ExpenseNotFoundException);
            }
        });
    });
});
