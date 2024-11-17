import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshTokenGuard } from 'src/common/guards';
import { LogOutDto } from './dto/logout.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Public()
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.login(loginUserDto);
  }
  @Public()
  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  async logout(@Body() logOutDto: LogOutDto) {
    return await this.usersService.logout(logOutDto);
  }

  @Public()
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Body() logOutDto: LogOutDto) {
    return await this.usersService.refreshToken(logOutDto);
  }

  @Get('checkToken')
  async checkToken() {
    return 'U logined';
  }
}
