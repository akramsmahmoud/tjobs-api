import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '../../shared/auth.gaurd';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly user: UserService;

  @Get()
  @UseGuards(new AuthGuard())
  public users(): Promise<User[]> {
    return this.user.getAllUsers();
  }

  @Get(':id')
  public getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.user.getUser(id);
  }

  @Post()
  public createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.user.createUser(body);
  }

  @Delete(':id')
  public deleteUser(@Param('id', ParseIntPipe) id: number): {} {
    this.user.deleteUser(id);
    return { deleted: true };
  }

  @Post('auth/login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: CreateUserDto) {
    return this.user.login(data);
  }

  @Post('auth/register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: CreateUserDto) {
    return this.user.createUser(data);
  }
}
