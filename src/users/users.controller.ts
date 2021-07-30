import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authsService: AuthService
  ) {}


  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);

    if(!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  getAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Post("/signup")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authsService.signup(createUserDto.email, createUserDto.password);
  }

  @Post('/signin')
  signinUser(@Body() body: CreateUserDto) {
    return this.authsService.signin(body.email, body.password);
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
