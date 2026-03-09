import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import request from 'supertest';
import { AppModule } from "../src/app.module";

describe('Posts (e2e)', () => {
    let app: INestApplication;
    let authToken: string;
    let postId: number;

    beforeAll(async() => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'posttest@example.com',
                password: 'password123',
            });

        const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            email: 'posttest@example.com',
            password: 'password123',
        });

        authToken = loginResponse.body.access_token;

        const postResponse = await request(app.getHttpServer())
            .post('/posts')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Test Post',
                content: 'This is a test post content'
            });

        postId = postResponse.body.id;
    });

    afterAll(async() => {
        await app.close();
    });

    describe('/posts (POST)', () => {
        it('should create a new post with valid token', () => {
            return request(app.getHttpServer())
                .post('/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Another Test Post',
                    content: 'This is another test post content'
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body).toHaveProperty('title', 'Another Test Post');
                    expect(res.body).toHaveProperty('content', 'This is another test post content');
                    postId = res.body.id;
                });
        });

        it('should fail to create post without token', () => {
            return request(app.getHttpServer())
                .post('/posts')
                .send({
                    title: 'Test Post',
                    content: 'This is a test post content',
                })
                .expect(401);
        });
    });

    describe('/posts (GET)', () => {
        it('should get all post without authentication', () => {
            return request(app.getHttpServer())
                .get('/posts')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBeGreaterThan(0);
                });
        });
    });

    describe('/posts/:id (GET)', () => {
        it('should get a single post be ID', () => {
            return request(app.getHttpServer())
                .get(`/posts/${postId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id', postId);
                    expect(res.body).toHaveProperty('title', 'Another Test Post');
                });
        });

        it('should return 404 for non-existent post', () => {
            return request(app.getHttpServer())
                .get('/posts/99999')
                .expect(404);
        });
    });

    describe('/posts/:id (PUT)', () => {
        it('should update post with valid token', () => {
            return request(app.getHttpServer())
                .put(`/posts/${postId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Updated Title',
                    content: 'Updated Content',
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('title', 'Updated Title');
                    expect(res.body).toHaveProperty('content', 'Updated Content');
                });
        });
        it('should fail to update post without token', () => {
            return request(app.getHttpServer())
                .put(`/posts/${postId}`)
                .send({
                    title: 'Updated Title',
                })
                .expect(401);
        });
    });

    describe('/posts/:id (DELETE)', () => {
        it('should delete post with valid token', () => {
            return request(app.getHttpServer())
                .delete(`/posts/${postId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('message', 'Post deleted successfully.');
                });
        });
        it('should fail to delete already deleted post', () => {
            return request(app.getHttpServer())
                .delete(`/posts/${postId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });
})