import { Post } from "../posts/post.entity";
export declare class User {
    id: number;
    email: string;
    password: string;
    posts: Post[];
}
