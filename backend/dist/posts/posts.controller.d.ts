import { PostsService } from './posts.service';
export declare class PostsController {
    private postsService;
    constructor(postsService: PostsService);
    create(req: any, body: {
        title: string;
        content: string;
    }): Promise<import("./post.entity").Post>;
    findAll(): Promise<import("./post.entity").Post[]>;
    findOne(id: string): Promise<import("./post.entity").Post>;
    update(req: any, id: string, body: {
        title: string;
        content?: string;
    }): Promise<import("./post.entity").Post>;
    delete(req: any, id: number): Promise<{
        message: string;
    }>;
}
