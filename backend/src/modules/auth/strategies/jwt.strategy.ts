import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenDenylistService } from "../token-denylist.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private tokenDenylistService: TokenDenylistService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: String(process.env.JWT_SECRET),
        });
    }

    async validate(payload: any) {
        const revoked = await this.tokenDenylistService.isRevoked(payload.jwtId);
        if (revoked) {
            throw new UnauthorizedException('Token has been revoked');
        }
        return payload;
    }
}