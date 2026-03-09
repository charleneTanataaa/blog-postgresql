import { Repository } from 'typeorm';
import { Post } from './post.entity';
export declare class PostsService {
    private repo;
    constructor(repo: Repository<Post>);
    create(title: string, content: string, userId: number): Promise<Post>;
    findAll(): Promise<Post[]>;
    findById(id: number): Promise<Post>;
    findByUser(userId: number): Promise<Post[]>;
    update(id: number, userId: number, title?: string, content?: string): Promise<Post>;
    delete(id: number, userId: number): Promise<{
        message: string;
    }>;
}
