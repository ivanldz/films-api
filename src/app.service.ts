import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { FilmsService } from './films/films.service';

@Injectable()
export class AppService {

  constructor(
    private readonly userService: UsersService,
    private readonly filmService: FilmsService
  ) { }

  getHalth(): string {
    return 'Im alive!';
  }

  async seedDB(): Promise<void> {
    const masterEmail = "admin@admin.com"
    const masterPassword = "123"
    await this.userService.createAdmin(
      masterEmail,
      masterPassword
    )
  }
}
