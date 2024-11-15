import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { JwtPayload, verify } from 'jsonwebtoken';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.body.refreshToken;
    const secret = process.env.SECRET ?? 'secret';
    try {
      const tokenData = verify(token, secret) as JwtPayload;
      const inTokenId = tokenData.data;

      const userFromDb = await this.userModel.findById(inTokenId);

      if (userFromDb && userFromDb.refreshTokens.indexOf(token) != -1) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
}
