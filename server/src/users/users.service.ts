import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  hashData(data: string) {
    return hash(data, 10);
  }

  createTokens(
    id: string,
    username: string,
  ): { accessToken: string; refreshToken: string } {
    return {
      accessToken: sign(
        {
          data: username,
        },
        process.env.SECRET ?? 'secret',
        { expiresIn: '30m' },
      ),
      refreshToken: sign(
        {
          data: id,
        },
        process.env.SECRET ?? 'secret',
        { expiresIn: '30d' },
      ),
    };
  }

  async create(newUser: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      username: newUser.username,
    });

    if (existingUser) {
      throw new HttpException(
        'User with this username already exists',
        HttpStatus.CONFLICT,
      );
    }
    try {
      const createdUser = await this.userModel.create({
        ...newUser,
        password: await this.hashData(newUser.password),
      });

      const userTokens = this.createTokens(
        createdUser._id.toString(),
        createdUser.username,
      );

      createdUser.refreshTokens.push(userTokens.refreshToken);
      await createdUser.save();

      return userTokens;
    } catch {
      throw new HttpException(
        'Unable to create User in database',
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
  }
}
