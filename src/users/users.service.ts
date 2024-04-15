import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Page } from 'src/global/interfaces/page.interface';
import { Roles } from 'src/auth/enums/roles.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(
        email: string,
        password: string,
        role: Roles,
    ): Promise<User> {
        const exist = await this.findOneBy({ email })
        if (exist) {
            throw new BadRequestException("user email already exists")
        }

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);
        const user = await this.userRepository.save({
            email: email,
            role: role,
            hash: hashedPassword,
            salt: salt,
        });

        return user;
    }

    async createAdmin(
        email: string,
        password: string,
    ): Promise<User> {
        return this.create(email, password, Roles.ADMIN);
    }

    async getUser(id: number): Promise<User> {
        return this.findOneBy({ id: id });
    }

    async findAll(
        page: number = 1,
        pageSize: number = 10,
    ): Promise<Page<User>> {
        const [records, total] = await this.userRepository.findAndCount({
            select: ['id', 'email', 'createdAt', 'updatedAt'],
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

    async findOneBy(filter: any) {
        const user = await this.userRepository.findOneBy(filter);
        return user;
    }

    async remove(id: number): Promise<User> {
        const user = await this.findOneBy({ id });
        if (!user) {
            throw new NotFoundException("user not found");
        }
        return this.userRepository.remove(user);
    }
}
