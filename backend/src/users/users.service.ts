import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) {}

    async create (
        email: string,
        password: string
    ){
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
    }

    async findByEmail(email: string){
        return this.repo.findOne({ where: { email } })
    }

    async findById(id: number){
        const user = await this.repo.findOne({ where: { id } });
        if(!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    async updateUser(id: number, email?: string, password?: string){
        const user = await this.findById(id);
        if(email && email !== user.email){
            const existingUser = await this.findByEmail(email);
            if(existingUser){
                throw new ConflictException('Email already in use.');
            }
            user.email = email;
        }
        if(password){
            user.password = await bcrypt.hash(password, 10);
        }

        return this.repo.save(user);
    }
}
