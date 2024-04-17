import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { HttpModule } from '@nestjs/axios';
import { SeedController } from './seed.controller';
import { UsersService } from 'src/users/users.service';
import { FilmsService } from 'src/films/films.service';
import { StarWarsRepository } from './star-wars.repository';
import { User } from 'src/users/entities/user.entity';
import { Film } from 'src/films/entities/film.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Film, User])],
  providers: [SeedService, UsersService, FilmsService, StarWarsRepository],
  controllers: [SeedController],
})
export class SeedModule {}
