import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from '../films.controller';
import { FilmsService } from '../films.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersServiceMock } from './mocks/services.mock';
import { FilmRepositoryMock } from './mocks/repository.mock';
import { JwtServiceMock } from 'src/auth/tests/mocks/services.mock';
import { ConfigService } from '@nestjs/config';

describe('FilmsController', () => {
  let controller: FilmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        FilmsService,
        ConfigService,
        {
          provide: JwtService,
          useClass: JwtServiceMock,
        },
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

    controller = module.get<FilmsController>(FilmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
