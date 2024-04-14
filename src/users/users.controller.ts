import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
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
        @Query('page') page: number,
        @Query('pageSize') pageSize: number,
    ): Promise<Page<User>> {
        return this.usersService.findAll(page, pageSize)
    }

    @Get(":id")
    async findById(@Param('id') id: number): Promise<User> {
        return this.usersService.getUser(id)
    }

    @Delete(":id")
    async remove(@Param('id') id: number): Promise<User> {
        return this.usersService.remove(id)
    }
}
