import { Role } from '../@types/role.type';

export interface JwtPayload {
    id: number;
    name: string;
    lastName: string;
    role: Role;
    email: string;
    documentNumber: string;
    createdAt: Date;
    updatedAt: Date;
}
