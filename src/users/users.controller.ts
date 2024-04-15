import { Controller, Delete, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Page } from 'src/global/interfaces/page.interface';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { Roles } from 'src/auth/enums/roles.enum';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Auth(Roles.ADMIN)
    async findAll(
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
    ): Promise<Page<User>> {
        return this.usersService.findAll(page, pageSize)
    }

    @Get(":id")
    async findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.getUser(id)
    }

    @Delete(":id")
    async remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.remove(id)
    }
}
