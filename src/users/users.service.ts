import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private usersRepository: Repository<User>
  ) {}

  find(email: string) {
    if (!email) {
      return this.usersRepository.find();
    }
    return this.usersRepository.find({ email });
  }


  findOne(id: number) {
    return this.usersRepository.findOne(id);
  }


  create(email: string, password: string) {
    const user = this.usersRepository.create({ email, password });
    return this.usersRepository.save(user);
  }

  async update(id: number, attributes: Partial<User>) {
    const user = await this.findOne(id);

    if(!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attributes);
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id)
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.remove(user);
  }
}
