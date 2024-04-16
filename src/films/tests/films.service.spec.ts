import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from '../films.service';
import { UsersService } from 'src/users/users.service';
import { UsersServiceMock } from './mocks/services.mock';
import { FilmRepositoryMock } from './mocks/repository.mock';
import { Film } from '../entities/film.entity';
import { Repository } from 'typeorm';
import { filmMock, userMock } from './mocks/values.mock';

describe('FilmsService', () => {
  let service: FilmsService;
  let userService: UsersService;
  let filmRepository: Repository<Film>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: UsersService,
          useClass: UsersServiceMock,
        },
        {
          provide: 'FilmRepository',
          useClass: FilmRepositoryMock,
        },
      ],
    }).compile();

    filmRepository = module.get<Repository<Film>>('FilmRepository');
    userService = module.get<UsersService>(UsersService);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFilm', () => {
    it('should upload a film', async () => {
      jest.spyOn(userService, 'findOneBy').mockResolvedValue(userMock);
      jest.spyOn(filmRepository, 'save').mockResolvedValue(filmMock);

      const result = await service.uploadFilm(
        filmMock.title,
        filmMock.description,
        userMock.id,
      );
      expect(result).toEqual(filmMock);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(userService, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.uploadFilm('Test Film', 'Test Description', 1),
      ).rejects.toThrow('User not found');
    });
  });

  describe('getFilm', () => {
    it('should get a film', async () => {
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(filmMock);
      const result = await service.getFilm(1);
      expect(result).toEqual(filmMock);
    });

    it('should throw an error if film is not found', async () => {
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(null);
      await expect(service.getFilm(1)).rejects.toThrow('Film not found');
    });
  });

  describe('findAllFilms', () => {
    it('should find all films', async () => {
      const page = 1;
      const pageSize = 10;
      jest
        .spyOn(filmRepository, 'findAndCount')
        .mockResolvedValue([[filmMock], 1]);

      const result = await service.findAllFilms(page, pageSize);

      expect(result).toEqual({
        records: [filmMock],
        paginations: {
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      });
    });

    it('should throw an error if page is negative', async () => {
      const page = -1;
      const pageSize = 10;
      await expect(service.findAllFilms(page, pageSize)).rejects.toThrow(
        'Page number must be greater than 0',
      );
    });

    it('should throw an error if pageSize is negative', async () => {
      const page = 1;
      const pageSize = -1;
      await expect(service.findAllFilms(page, pageSize)).rejects.toThrow(
        'Page size must be between 0 and 20',
      );
    });

    it('should throw an error if pageSize is greater to 20', async () => {
      const page = 1;
      const pageSize = 100;
      await expect(service.findAllFilms(page, pageSize)).rejects.toThrow(
        'Page size must be between 0 and 20',
      );
    });

    it('should find all films without parameters', async () => {
      jest
        .spyOn(filmRepository, 'findAndCount')
        .mockResolvedValue([[filmMock], 1]);

      const result = await service.findAllFilms();

      expect(result).toEqual({
        records: [filmMock],
        paginations: {
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      });
    });
  });

  describe('updateFilm', () => {
    it('should update a film', async () => {
      jest.spyOn(filmRepository, 'findOneBy').mockResolvedValue(filmMock);
      jest.spyOn(filmRepository, 'save').mockResolvedValue(filmMock);

      const updatedData = { title: 'Updated Title' };
      const result = await service.updateFilm(1, updatedData);

      expect(result).toEqual(filmMock);
      expect(result.title).toEqual(updatedData.title);
    });

    it('should throw an error if film is not found', async () => {
      jest.spyOn(filmRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.updateFilm(1, {})).rejects.toThrow('Film not found');
    });
  });

  describe('deleteFilm', () => {
    it('should delete a film', async () => {
      jest.spyOn(filmRepository, 'findOneBy').mockResolvedValue(filmMock);
      jest.spyOn(filmRepository, 'remove').mockResolvedValue(undefined);

      const result = await service.deleteFilm(1);

      expect(result).toEqual(true);
    });

    it('should throw an error if film is not found', async () => {
      jest.spyOn(filmRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.deleteFilm(1)).rejects.toThrow('Film not found');
    });
  });
});
