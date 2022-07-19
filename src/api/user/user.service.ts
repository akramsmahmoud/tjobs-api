import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  public getAllUsers(): Promise<User[]> {
    return this.repository.find();
  }

  public getUser(id: number): Promise<User> {
    return this.repository.findOneBy({ id });
  }

  public createUser(body: CreateUserDto): Promise<User> {
    const user: User = new User();

    user.name = body.name;
    user.email = body.email;
    user.password = body.password;

    return this.repository.save(user);
  }

  public deleteUser(id: number): {} {
    return this.repository.delete({ id });
  }

  async login(data: CreateUserDto) {
    const { email, password } = data;
    const user = await this.repository.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
}
