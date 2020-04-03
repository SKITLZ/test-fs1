import { Controller, Post, Body } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto, AuthUserDto } from './user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  createUser(
    @Body() createUser: CreateUserDto,
  ) {
    return this.usersService.createUser(createUser);
  }

  @Post('auth')
  authUser(
    @Body() authUserDto: AuthUserDto,
  ) {
    return this.usersService.authUser(authUserDto);
  }
}
