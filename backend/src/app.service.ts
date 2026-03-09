import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      Welcome to Raft! 🦦 \n
      Frontend coming soon.  \n
      
      API Documentation: \n
      https://charlenetanataaa-801756.postman.co/workspace/Charlene-Tanata's-Workspace~fcd569b1-d0f8-4858-846b-af520752cef0/collection/51999065-853258a9-d9e1-4d26-9109-fa6fe1ba5a51?action=share&creator=51999065
    `
    ;
  }
}
