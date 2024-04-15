import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../services/prisma.service';
import { User } from '../../interfaces';

@Injectable()
export class UsersRepository {
    constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

    async create(data: User): Promise<User> {
        return (await this.prismaService.user.create({
            data: data as any,
        })) as User;
    }

    async get(id: number): Promise<User> {
        return (await this.prismaService.user.findUnique({
            where: { id },
        })) as User;
    }

    async getByEmail(email: string): Promise<User> {
        return (await this.prismaService.user.findFirst({
            where: { email },
        })) as User;
    }
}
