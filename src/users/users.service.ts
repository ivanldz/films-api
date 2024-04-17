import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Page } from 'src/global/interfaces/page.interface';
import { Roles } from 'src/auth/enums/roles.enum';
import { UserList } from './interfaces/user-list.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(email: string, password: string, role: Roles): Promise<User> {
    const exist = await this.findOneBy({ email });
    if (exist) {
      throw new BadRequestException('user email already exists');
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await this.userRepository.save({
      email: email,
      role: role,
      hash: hashedPassword,
    });

    return user;
  }

  async createAdmin(email: string, password: string): Promise<User> {
    return this.create(email, password, Roles.ADMIN);
  }

  async getUser(id: number): Promise<User> {
    const user = await this.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Page<UserList>> {
    if (page < 1) {
      throw new BadRequestException('Page number must be greater than 0');
    }

    if (pageSize < 1 || pageSize > 20) {
      throw new BadRequestException('Page size must be between 0 and 20');
    }

    const [records, total] = await this.userRepository.findAndCount({
      select: ['id', 'email', 'role'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      records,
      paginations: {
        page,
        pageSize,
        totalPages,
      },
    };
  }

  async findOneBy(filter: any): Promise<User> {
    const user = await this.userRepository.findOneBy(filter);
    return user;
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.userRepository.remove(user);
  }

  async setAdmin(id: number): Promise<User> {
    const user = await this.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    user.role = Roles.ADMIN;
    await this.userRepository.save(user);
    return user;
  }
}
