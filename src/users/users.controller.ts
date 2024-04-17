import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { Page } from 'src/global/interfaces/page.interface';
import { UsersService } from './users.service';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { Roles } from 'src/auth/enums/roles.enum';
import { UserList } from './interfaces/user-list.interface';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Auth(Roles.ADMIN)
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ): Promise<Page<UserList>> {
    return this.usersService.findAll(page, pageSize);
  }

  @Get(':id')
  @Auth(Roles.ADMIN)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getUser(id);
  }

  @Delete(':id')
  @Auth(Roles.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.remove(id);
  }

  @Patch(':id/set-admin')
  @Auth(Roles.ADMIN)
  async setAdmin(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.setAdmin(id);
  }
}
