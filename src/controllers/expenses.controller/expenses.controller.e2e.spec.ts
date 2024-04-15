import {
    HttpException,
    HttpStatus,
    INestApplication,
    Request,
    ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { ExpensesService } from '../../providers';
import { Expense } from '../../interfaces';
import { AppModule } from '../../modules';
import {
    VALIDATION_ERROR_MESSAGE,
    VALIDATION_ERROR_STATUS_CODE,
} from '../../constants';

describe('Expenses e2e', () => {
    let app: INestApplication;

    const mockExpenses = [
        {
            id: 3,
            description: 'test',
            userId: 1,
            value: 4.24,
            date: '2024-04-15T10:38:54.000Z',
            createdAt: '2024-04-13T17:07:02.850Z',
            updatedAt: '2024-04-13T17:07:02.850Z',
        },
        {
            id: 4,
            description: 'test',
            userId: 2,
            value: 4.24,
            date: '2024-04-15T10:38:54.000Z',
            createdAt: '2024-04-13T17:11:04.518Z',
            updatedAt: '2024-04-13T17:11:04.518Z',
        },
        {
            id: 5,
            description: 'test',
            userId: 1,
            value: 4.24,
            date: '2024-04-15T10:38:54.000Z',
            createdAt: '2024-04-13T17:42:35.779Z',
            updatedAt: '2024-04-13T17:42:35.779Z',
        },
    ];

    const token =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IkRvZSIsInJvbGUiOiJBZG1pbiIsImRvY3VtZW50TnVtYmVyIjoiMTIzNDU2Nzg5IiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImNyZWF0ZWRBdCI6IjIwMjQtMDQtMTNUMTQ6MDA6NDguMzUzWiIsInVwZGF0ZWRBdCI6IjIwMjQtMDQtMTNUMTQ6MDA6NDguMzUzWiIsImlhdCI6MTcxMzIwOTA2Mn0.Bu_ReHL9gQYFPX460J56My07aGAKB89wQpmgRmd2JkI';

    const mockExpenseService = {
        getByUser(userId: number) {
            return mockExpenses.filter((expense) => expense.userId === userId);
        },

        get(id: number, userId: number) {
            return (
                mockExpenses.find(
                    (expense) =>
                        +expense.userId === +userId && +expense.id === +id
                ) || null
            );
        },

        create(data: Expense) {
            return data;
        },

        update(id: number, data: Expense) {
            const current = mockExpenses.find(
                (expense) =>
                    +expense.userId === +data.userId && +expense.id === +id
            );

            return { ...current, ...data };
        },

        delete(id: number, userId: number) {
            return mockExpenses.find(
                (expense) => +expense.userId === +userId && +expense.id === +id
            );
        },
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(ExpensesService)
            .useValue(mockExpenseService)
            .compile();

        app = moduleRef.createNestApplication();

        const validationOptions = {
            exceptionFactory: (errors) => {
                const message = VALIDATION_ERROR_MESSAGE;
                const statusCode = VALIDATION_ERROR_STATUS_CODE;
                return new HttpException({ message, errors }, statusCode);
            },
            transform: true,
            forbidUnknownValues: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        };

        app.useGlobalPipes(new ValidationPipe(validationOptions));

        await app.init();
    });

    describe('GET method', () => {
        it(`/GET expenses: should return success for authorized user`, async () => {
            return request(app.getHttpServer())
                .get('/expenses')
                .set('Authorization', token)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).toEqual(
                        mockExpenseService.getByUser(1)
                    );
                });
        });

        it(`/GET expenses: should return error for unauthorized users`, () => {
            return request(app.getHttpServer())
                .get('/expenses')
                .expect(HttpStatus.UNAUTHORIZED);
        });

        it(`/GET expenses/3: should return success for authorized user`, async () => {
            return request(app.getHttpServer())
                .get('/expenses/3')
                .set('Authorization', token)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).toEqual(mockExpenseService.get(3, 1));
                });
        });

        it(`/GET expenses/3:  should return error for unauthorized users`, () => {
            return request(app.getHttpServer())
                .get('/expenses/3')
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });

    describe('POST method', () => {
        it(`/POST expenses:  should return success when the correct data is passed`, async () => {
            const expense = {
                description: 'test',
                value: 10,
                date: '2024-04-15T10:38:54.000Z',
            };

            return request(app.getHttpServer())
                .post('/expenses')
                .send(expense)
                .set('Authorization', token)
                .expect(HttpStatus.CREATED)
                .then((response) => {
                    expect(response.body).toEqual({ ...expense, userId: 1 });
                });
        });

        it(`/POST expenses:  should return error when no token is provided`, async () => {
            const expense = {
                description: 'test',
                value: 10,
                date: '2024-04-15T10:38:54.000Z',
            };

            return request(app.getHttpServer())
                .post('/expenses')
                .send(expense)
                .expect(HttpStatus.UNAUTHORIZED);
        });

        it(`/POST expenses:  should return error when description is an empty string`, async () => {
            const expense = {
                description: '',
                value: 4.24,
                date: '2024-04-22',
            };

            return request(app.getHttpServer())
                .post('/expenses')
                .send(expense)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/POST expenses:  should return error when the description is a non string`, async () => {
            const expense = {
                description: 2,
                value: 4.24,
                date: '2024-04-22',
            };

            return request(app.getHttpServer())
                .post('/expenses')
                .send(expense)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/POST expenses:  should return error when the description is not passed`, async () => {
            const expense = {
                value: 4.24,
                date: '2024-04-22',
            };

            return request(app.getHttpServer())
                .post('/expenses')
                .send(expense)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/POST expenses:  should return error when value is negative`, async () => {
            const expense = {
                description: 'test',
                value: -1,
                date: '2024-04-22',
            };

            return request(app.getHttpServer())
                .post('/expenses')
                .send(expense)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/POST expenses:  should return error when value is a non number`, async () => {
            const expense = {
                description: 'test',
                value: '4.24',
                date: '2024-04-22',
            };

            return request(app.getHttpServer())
                .post('/expenses')
                .send(expense)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/POST expenses:  should return error when value is not passed`, async () => {
            const expense = {
                description: 'test',
                date: '2024-04-22',
            };

            return request(app.getHttpServer())
                .post('/expenses')
                .send(expense)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/POST expenses:  should return error when date is greater than today`, async () => {
            const expense = {
                description: 'test',
                value: '4.24',
                date: '2055-04-23',
            };

            return request(app.getHttpServer())
                .post('/expenses')
                .send(expense)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/POST expenses:  should return error when date a non date is passed`, async () => {
            const expense = {
                description: 'test',
                value: '4.24',
                date: 'test',
            };

            return request(app.getHttpServer())
                .post('/expenses')
                .send(expense)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/POST expenses:  should return error when date is not passed`, async () => {
            const expense = {
                description: 'test',
                value: '4.24',
            };

            return request(app.getHttpServer())
                .post('/expenses')
                .send(expense)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });
    });

    describe('PUT method', () => {
        it(`/PUT expenses/3:  should return error when no token is provided`, async () => {
            const payload = {
                description: 'test',
            };

            return request(app.getHttpServer())
                .put('/expenses/3')
                .send(payload)
                .expect(HttpStatus.UNAUTHORIZED);
        });

        it(`/PUT expenses/3:  should return success when only a description is passed`, async () => {
            const payload = {
                description: 'test',
            };

            return request(app.getHttpServer())
                .put('/expenses/3')
                .send(payload)
                .set('Authorization', token)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining(payload)
                    );
                });
        });

        it(`/PUT expenses/3:  should return error when the description is an empty string`, async () => {
            const payload = {
                description: '',
            };

            return request(app.getHttpServer())
                .put('/expenses/3')
                .send(payload)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/PUT expenses/3:  should return error when the description is not a string`, async () => {
            const payload = {
                description: 123,
            };

            return request(app.getHttpServer())
                .put('/expenses/3')
                .send(payload)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/PUT expenses/3:  should return success when only a value is passed`, async () => {
            const payload = {
                value: 10,
            };

            return request(app.getHttpServer())
                .put('/expenses/3')
                .send(payload)
                .set('Authorization', token)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining(payload)
                    );
                });
        });

        it(`/PUT expenses/3:  should return error when the value is negative`, async () => {
            const payload = {
                value: -10,
            };

            return request(app.getHttpServer())
                .put('/expenses/3')
                .send(payload)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/PUT expenses/3:  should return error when the value is not a number`, async () => {
            const payload = {
                value: 'test',
            };

            return request(app.getHttpServer())
                .put('/expenses/3')
                .send(payload)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/PUT expenses/3:  should return success when only a date is passed`, async () => {
            const payload = {
                date: '2024-04-12T00:00:00.000Z',
            };

            return request(app.getHttpServer())
                .put('/expenses/3')
                .send(payload)
                .set('Authorization', token)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining(payload)
                    );
                });
        });

        it(`/PUT expenses/3:  should return error when the date is greater than today`, async () => {
            const payload = {
                date: '2055-04-12',
            };

            return request(app.getHttpServer())
                .put('/expenses/3')
                .send(payload)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/PUT expenses/3:  should return error when the date is not a date`, async () => {
            const payload = {
                date: 'teste',
            };

            return request(app.getHttpServer())
                .put('/expenses/3')
                .send(payload)
                .set('Authorization', token)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it(`/PUT expenses/3:  should return success when all parameters are passed`, async () => {
            const payload = {
                description: 'test',
                value: 10,
                date: '2024-04-12T00:00:00.000Z',
            };

            return request(app.getHttpServer())
                .put('/expenses/3')
                .send(payload)
                .set('Authorization', token)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining(payload)
                    );
                });
        });
    });

    describe('DELETE method', () => {
        it(`/DELETE expenses/3: should return success for authorized user`, async () => {
            return request(app.getHttpServer())
                .delete('/expenses/3')
                .set('Authorization', token)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).toEqual(
                        mockExpenseService.delete(3, 1)
                    );
                });
        });

        it(`/DELETE expenses/3:  should return error for unauthorized users`, () => {
            return request(app.getHttpServer())
                .delete('/expenses/3')
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
