import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  hashData(data: string) {
    return hash(data, 10);
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
      await this.userModel.create({
        ...newUser,
        password: await this.hashData(newUser.password),
      });
      return;
    } catch {
      throw new HttpException(
        'Unable to create User in database',
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
  }
}