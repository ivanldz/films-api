import { BadRequestException, Injectable } from '@nestjs/common';
import { Film } from 'src/films/entities/film.entity';
import { FilmsService } from 'src/films/films.service';
import { UsersService } from 'src/users/users.service';
import { StarWarsRepository } from './star-wars.repository';
import { AdminData, SeedResponse } from './interfaces/response.interfaces';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: UsersService,
    private readonly filmService: FilmsService,
    private readonly starWarsRepository: StarWarsRepository,
  ) {}

  async seedDB(): Promise<SeedResponse> {
    const dbFilms = await this.filmService.findAllFilms(1, 1);
    const dbUsers = await this.userService.findAll(1, 1);

    if (dbFilms.records.length > 0 || dbUsers.records.length > 0) {
      throw new BadRequestException('You can only initialize an empty db');
    }

    const masterUser = await this.createMasterUser();
    const films = await this.createFilms(masterUser.id);
    return {
      adminCreated: masterUser,
      totalFilmsCreated: films.length,
    };
  }

  async createMasterUser(): Promise<AdminData> {
    const masterEmail = 'admin@admin.com';
    const masterPassword = '123';
    const user = await this.userService.createAdmin(
      masterEmail,
      masterPassword,
    );
    if (!user) {
      throw new Error('The user could not be created');
    }
    return {
      id: user.id,
      email: masterEmail,
      password: masterPassword,
    };
  }

  async createFilms(createdById: number): Promise<Film[]> {
    const {
      data: { results },
    } = await this.starWarsRepository.findAllFilms();
    const operations: Promise<Film>[] = [];

    for (const result of results) {
      const film = this.filmService.uploadFilm(
        result.title,
        result.opening_crawl,
        createdById,
      );
      operations.push(film);
    }

    return Promise.all(operations);
  }
}
