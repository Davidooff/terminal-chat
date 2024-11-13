import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // If used @Public() decorator bypass accessToken check (it's made bks AccessTokenGuard set as globalGuard)
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // Checking access token
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [, token] = authHeader.split(' ');
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      // Verify the token
      verify(token, process.env.SECRET ?? 'secret');
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
