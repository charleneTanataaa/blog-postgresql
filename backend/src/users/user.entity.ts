import { Post } from "../posts/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users', schema:'public'})
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false  })
    email: string;

    @Column({ type: 'varchar', length: 255})
    password: string;

    @OneToMany(() => Post, post => post.user)
    posts: Post[];
}