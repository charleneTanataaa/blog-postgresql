import { Body, Controller, Post, UseGuards, Request, Get, Param, Delete, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService){}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Request() req,
        @Body() body: {title: string, content: string}
    ){
        return this.postsService.create(body.title, body.content, req.user.id);
    }

    @Get()
    async findAll(){
        return this.postsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string){
        return this.postsService.findById(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() body: { title: string; content?: string }
    ){
        return this.postsService.update(+id, req.user.id, body.title, body.content);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(
        @Request() req,
        @Param('id') id: number
    ){
        return this.postsService.delete(id, req.user.id);
    }

}
