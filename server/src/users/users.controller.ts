import { Controller, Post, Body } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  createUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.createUser(name, email, password);
  }

  @Post('auth')
  authUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.authUser(email, password);
  }
}
