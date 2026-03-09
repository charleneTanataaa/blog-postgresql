import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import passport from 'passport';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'user@gmail.com',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('email', 'user@gmail.com');
        expect(res.body).not.toHaveProperty('password123');
      });
    });

    it('should fail to register with duplicate email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: "user@gmail.com",
          password: 'password123',
        })
        .expect(409);
    });

    it('should fail to register without email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          password: 'password123'
        })
        .expect(400);
    });
    it('should fail to register without password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'user@gmail.com',
        })
        .expect(400);
    });
  });

  describe('auth/login/ (POST)', () => {
    it('should login successfully and return JWT token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: "user@gmail.com",
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(typeof res.body.access_token).toBe('string');
          authToken = res.body.access_token;
        });
    });

    it('should fail to login with wrong password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: "user@gmail.com",
          password: "wrongpassword",
        })
        .expect(401);
    });

    it("should fail to login with non-existent email", () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: "non-existent@example.com",
          password: "password123"
        })
        .expect(401);
    });
  });

  describe('Protected Routes with JWT', () => {
    let token: string;

    beforeAll(async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: "user@gmail.com",
                password: "password123",
            });
        token = response.body.access_token;
    });

    it('should access protected route with valid token', () => {
        return request(app.getHttpServer())
            .get('/users/profile')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('email', 'user@gmail.com');
                expect(res.body).toHaveProperty('id');
            });
    });

    it('should fail to access protected route without token', () => {
        return request(app.getHttpServer())
            .get('/users/profile')
            .expect(401);
    });

    it('should fail to access protected route with invalid token', () => {
        return request(app.getHttpServer())
            .get('/users/profile')
            .set('Authorization', `Bearer invalidtoken123`)
            .expect(401);
    });

    it('should update user profile with valid token', () => {
        return request(app.getHttpServer())
            .put('/users/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'updated@gmail.com',
                password: 'newpassword',
            })
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('email', 'updated@gmail.com');
            });
    });

    it('should logout successfullt', () => {
        return request(app.getHttpServer())
            .post('/auth/logout')
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('message', 'Logout successful.');
            })
    })
  })

});
