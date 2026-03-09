import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private repo: Repository<Post>,
    ){}

    async create(title: string, content: string, userId: number){
        const post = this.repo.create({
            title,
            content,
            user: {id: userId}
        });
        return this.repo.save(post);
    }

    async findAll(){
        return this.repo.find({ relations: ['user' ]});
    }

    async findById(id: number){
        const post = await this.repo.findOne({
            where: { id },
            relations: ['user']
        });

        if(!post){
            throw new NotFoundException('Post not found.');
        }

        return post;
    }

    async findByUser(userId: number){
        const posts = this.repo.find({
            where: { user: {id: userId} },
            relations: ['user']
        });
        return posts;
    }

    async update(id: number, userId: number, title?:string, content?: string){
        const post = await this.findById(id);
        if(post.user.id != userId){
            throw new ForbiddenException('You can only edit your own post');
        }
        if (title) post.title = title;
        if (content) post.content =content;

        return this.repo.save(post);
    }

    async delete(id: number, userId: number){
        const post = await this.findById(id);
        if(post.user.id != userId){
            throw new ForbiddenException('You can only delete your own posts.');
        }
        await this.repo.remove(post);
        return { message: 'Post deleted successfully.'};
    }
}
