import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';


@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}
    
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req){
        return this.usersService.findById(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(
        @Request() req,
        @Body() body: { email?: string; password?: string }
    ){
        return this.usersService.updateUser(
            req.user.id,
            body.email,
            body.password
        );
    }
}
