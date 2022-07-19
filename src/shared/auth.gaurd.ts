import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }

    request.user = await this.validateToken(request.headers.authorization);
    return true;
  }

  async validateToken(auth: string) {
    const splitAuth = auth.split(' ');
    if (splitAuth[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const token = splitAuth[1];

    try {
      const decoded: any = await jwt.verify(
        token,
        this.config.get<string>('JWT_SECRET'),
      );

      return decoded;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }
}
