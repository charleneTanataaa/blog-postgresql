import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async register(email: string, password: string){
        if(!email || !password){
            throw new BadRequestException('Email and password are required.');
        }
        
        const findByEmail = await this.usersService.findByEmail(email);
        if(findByEmail){
            throw new ConflictException('Email already exists');
        }

        const hashed = await bcrypt.hash(password, 10);
        return this.usersService.create(email, hashed);
    }

    async login(email: string, password: string){
        // find user by email
        const user = await this.usersService.findByEmail(email);

        if(!email || !password){
            throw new BadRequestException('Email and password are required.');
        }

        if(!user){
            throw new UnauthorizedException("Invalid Email");
        }

        // validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid User');
        }

        // generate token
        const payload = { sub: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
        }
    }
}
