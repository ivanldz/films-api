import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
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
        const exist = await this.findOneBy({email})
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

    async resetPasswordToken(userId: number): Promise<string> {
        const token = uuid();
        await this.userRepository.save({
            id: userId,
            resetPasswordToken: token,
        });

        return token;
    }

    async getUser(id: number): Promise<User> {
        return this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id: id })
            .getOne();
    }

    async savePassword(user: User, password: string): Promise<void> {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);
        await this.userRepository.update(
            {
                id: user.id,
            },
            {
                resetPasswordToken: null,
                hash: hashedPassword,
                salt: salt,
            },
        );
    }

    async findAll(
        page: number = 1,
        pageSize: number = 10,
    ): Promise<Page<User>> {
        const skip = (page - 1) * pageSize;

        const [records, total] = await this.userRepository
            .createQueryBuilder('user')
            .select([
                'user.id',
                'user.email',
                'user.createdAt',
                'user.updatedAt'
            ])
            .skip(skip)
            .take(pageSize)
            .getManyAndCount();

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
        const user = await this.userRepository.findOneBy({ id });
        return this.userRepository.remove(user);
    }
}
