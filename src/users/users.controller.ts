import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}


  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get()
  getAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Post("/signup")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto.email, createUserDto.password);
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
