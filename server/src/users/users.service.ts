import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  // Inject the User model into the service
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Hashes the provided data using bcrypt.
   * @param data - The string to hash.
   * @returns A promise that resolves to the hashed string.
   */
  async hashData(data: string): Promise<string> {
    return hash(data, 10);
  }

  /**
   * Generates access and refresh tokens for a user.
   * @param id - The user's unique identifier.
   * @param username - The user's username.
   * @returns An object containing the accessToken and refreshToken.
   */
  createTokens(
    id: string,
    username: string,
  ): { accessToken: string; refreshToken: string } {
    const secret = process.env.SECRET ?? 'secret';

    // Generate an access token with the username, expires in 30 minutes
    const accessToken = sign({ data: username }, secret, { expiresIn: '30m' });

    // Generate a refresh token with the user ID, expires in 30 days
    const refreshToken = sign({ data: id }, secret, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }

  /**
   * Validates a JWT token.
   * @param token - The token to validate.
   * @returns True if the token is valid, otherwise false.
   */
  isValid(token: string): boolean {
    try {
      verify(token, process.env.SECRET ?? 'secret');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Filters and returns only valid tokens from a list.
   * @param tokens - An array of tokens to validate.
   * @returns An array of valid tokens.
   */
  returnOnlyValidTokens(tokens: string[]): string[] {
    return tokens.filter((token) => this.isValid(token));
  }

  /**
   * Creates a new user in the database.
   * @param newUser - The data transfer object containing new user information.
   * @returns A promise that resolves to an object containing the tokens.
   */
  async create(
    newUser: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Check if the username already exists
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
      // Hash the user's password
      const hashedPassword = await this.hashData(newUser.password);

      // Create the new user with the hashed password
      const createdUser = await this.userModel.create({
        ...newUser,
        password: hashedPassword,
      });

      // Generate authentication tokens for the new user
      const userTokens = this.createTokens(
        createdUser._id.toString(),
        createdUser.username,
      );

      // Save the refresh token in the user's document
      createdUser.refreshTokens.push(userTokens.refreshToken);
      await createdUser.save();

      // Return the tokens to the client
      return userTokens;
    } catch {
      throw new HttpException(
        'Unable to create user in database',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Authenticates a user and returns new tokens.
   * @param userData - The data transfer object containing login information.
   * @returns A promise that resolves to an object containing the tokens.
   */
  async login(
    userData: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Find the user by username
    const userDb = await this.userModel.findOne({
      username: userData.username,
    });

    if (!userDb) {
      throw new HttpException(
        'User with this username does not exist',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await compare(userData.password, userDb.password);
    if (isPasswordCorrect) {
      // Generate new authentication tokens
      const userTokens = this.createTokens(
        userDb._id.toString(),
        userDb.username,
      );

      // Clean up expired tokens from the user's refresh tokens
      userDb.refreshTokens = this.returnOnlyValidTokens(userDb.refreshTokens);

      // Add the new refresh token to the user's document
      userDb.refreshTokens.push(userTokens.refreshToken);
      await userDb.save();

      // Return the new tokens to the client
      return userTokens;
    } else {
      throw new HttpException('Password incorrect', HttpStatus.UNAUTHORIZED);
    }
  }
}
