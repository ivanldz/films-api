import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { UsersService } from 'src/users/users.service';
import { Film } from './entities/film.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Film, User])],
  controllers: [FilmsController],
  providers: [FilmsService, UsersService, JwtService],
})
export class FilmsModule {}
