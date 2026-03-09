import { User } from './user.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private readonly repo;
    constructor(repo: Repository<User>);
    create(email: string, password: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User>;
    updateUser(id: number, email?: string, password?: string): Promise<User>;
}
