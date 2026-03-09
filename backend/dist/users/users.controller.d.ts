import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("./user.entity").User>;
    updateProfile(req: any, body: {
        email?: string;
        password?: string;
    }): Promise<import("./user.entity").User>;
}
