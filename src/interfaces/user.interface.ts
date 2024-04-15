import { Role } from '../@types/role.type';

export interface User {
    id: number;
    name: string;
    lastName: string;
    role: Role;
    email: string;
    password?: string;
    documentNumber: string;
    createdAt?: Date;
    updatedAt?: Date;
}
