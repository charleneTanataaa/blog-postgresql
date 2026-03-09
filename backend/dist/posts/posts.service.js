"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./post.entity");
let PostsService = class PostsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(title, content, userId) {
        const post = this.repo.create({
            title,
            content,
            user: { id: userId }
        });
        return this.repo.save(post);
    }
    async findAll() {
        return this.repo.find({ relations: ['user'] });
    }
    async findById(id) {
        const post = await this.repo.findOne({
            where: { id },
            relations: ['user']
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found.');
        }
        return post;
    }
    async findByUser(userId) {
        const posts = this.repo.find({
            where: { user: { id: userId } },
            relations: ['user']
        });
        return posts;
    }
    async update(id, userId, title, content) {
        const post = await this.findById(id);
        if (post.user.id != userId) {
            throw new common_1.ForbiddenException('You can only edit your own post');
        }
        if (title)
            post.title = title;
        if (content)
            post.content = content;
        return this.repo.save(post);
    }
    async delete(id, userId) {
        const post = await this.findById(id);
        if (post.user.id != userId) {
            throw new common_1.ForbiddenException('You can only delete your own posts.');
        }
        await this.repo.remove(post);
        return { message: 'Post deleted successfully.' };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map