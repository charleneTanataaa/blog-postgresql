import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { emitWarning } from "process";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private usersService: UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secret-key',
        });
    }

    async validate(payload: any){
        const user = await this.usersService.findByEmail(payload.email);

        if(!user) {
            throw new UnauthorizedException();
        }

        return{ id: payload.sub, email: payload.email};

    }
}