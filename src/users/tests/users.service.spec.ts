import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UserRepositoryMock } from './mocks/repository.mock';
import { Roles } from 'src/auth/enums/roles.enum';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useClass: UserRepositoryMock
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("create method", () => {

    it(
      'should create a user and have their hashes defined',
      async () => {
        const newUser = await service.create(
          'test@test.com',
          "123",
          Roles.REGULAR
        )

        expect(newUser).toBeDefined();
        expect(newUser.hash).toBeDefined();
        expect(newUser.salt).toBeDefined();
      });

    it(
      'fails if the user already exists',
      async () => {
        expect(service.create(
          'example@example.com',
          "123",
          Roles.REGULAR
        )).rejects.toThrow('user email already exists')
      });
  })
});
