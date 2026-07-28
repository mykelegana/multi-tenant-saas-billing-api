import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class TokenDenylistService {
    constructor(@Inject('REDIS_CLIENT') private redis: Redis) { }

    async revoke(jwtId: string, expiresInSeconds: number) {
        await this.redis.set(`denylist:${jwtId}`, '1', 'EX', expiresInSeconds);
    }

    async isRevoked(jwtId: string): Promise<boolean> {
        const result = await this.redis.get(`denylist:${jwtId}`);
        return result !== null;
    }
}