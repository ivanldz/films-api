import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from '../seed.service';
import { BadRequestException } from '@nestjs/common';
import { StarWarsRepository } from '../star-wars.repository';
import { FilmsService } from 'src/films/films.service';
import { UsersService } from 'src/users/users.service';
import {
  FilmServiceMock,
  StarWarsRepositoryMock,
  UsersServiceMock,
} from './mocks/services.mocks';
import { Page } from 'src/global/interfaces/page.interface';
import { User } from 'src/users/entities/user.entity';
import { Film } from 'src/films/entities/film.entity';
import { StarWarsFilmResponse } from '../interfaces/star-wars.interface';
import { AxiosResponse } from 'axios';

describe('SeedService', () => {
  let seedService: SeedService;
  let usersService: UsersService;
  let filmsService: FilmsService;
  let starWarsRepository: StarWarsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: FilmsService, useClass: FilmServiceMock },
        { provide: StarWarsRepository, useClass: StarWarsRepositoryMock },
      ],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
    usersService = module.get(UsersService);
    filmsService = module.get(FilmsService);
    starWarsRepository = module.get(StarWarsRepository);
  });

  it('should be defined', () => {
    expect(seedService).toBeDefined();
  });

  describe('seedDB', () => {
    it('should seed the database with master user and films', async () => {
      jest
        .spyOn(usersService, 'findAll')
        .mockResolvedValue({ records: [] } as Page<User>);
      jest
        .spyOn(filmsService, 'findAllFilms')
        .mockResolvedValue({ records: [] } as Page<Film>);

      const mockMasterUser = { id: 1 };
      jest
        .spyOn(usersService, 'createAdmin')
        .mockResolvedValue(mockMasterUser as User);

      const mockStarWarsFilms = [
        { title: 'Film 1', opening_crawl: 'Opening 1' },
        { title: 'Film 2', opening_crawl: 'Opening 2' },
      ];
      jest.spyOn(starWarsRepository, 'findAllFilms').mockResolvedValue({
        data: { results: mockStarWarsFilms },
      } as AxiosResponse<StarWarsFilmResponse>);

      jest
        .spyOn(filmsService, 'uploadFilm')
        .mockResolvedValue({ id: 1 } as Film);
      jest
        .spyOn(filmsService, 'uploadFilm')
        .mockResolvedValue({ id: 2 } as Film);

      const result = await seedService.seedDB();

      expect(result.adminCreated).toBeDefined();
      expect(result.totalFilmsCreated).toBe(2);
    });

    it('should throw BadRequestException if there are existing users or films in the database', async () => {
      jest
        .spyOn(usersService, 'findAll')
        .mockResolvedValue({ records: [{ id: 1 }] } as Page<User>);

      jest
        .spyOn(filmsService, 'findAllFilms')
        .mockResolvedValue({ records: [{ id: 1 }] } as Page<Film>);

      await expect(seedService.seedDB()).rejects.toThrow(BadRequestException);
    });
  });
});
