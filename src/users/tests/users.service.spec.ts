import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UserRepositoryMock } from './mocks/repository.mock';
import { Roles } from 'src/auth/enums/roles.enum';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: UserRepositoryMock;
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
    userRepository = module.get<UserRepositoryMock>('UserRepository');
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {

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

  describe("createAdmin", () => {
    it(
      'The user is a admin',
      async () => {
        const newUser = await service.createAdmin(
          'test@example.com',
          "123",
        )
        expect(newUser.role).toBe(Roles.ADMIN)
      });
  })

  describe("getUser", () => {
    it(
      'Get the user',
      async () => {
        const user = await service.getUser(1)
        expect(user).toBeDefined();
      });
  })

  describe("findAll", () => {
    it('should return a page of users', async () => {
      const pageSize = 10;
      const page = 1;

      const result = await service.findAll(page, pageSize);
      expect(result.records.length).toBeDefined()
      expect(result.paginations.page).toEqual(page);
      expect(result.paginations.pageSize).toEqual(pageSize);
      expect(result.paginations.totalPages).toEqual(1);
    });

  })
  describe('findOneBy', () => {
    it('should return the user when a valid filter is provided', async () => {
      const filter = { email: 'example@example.com' };
      const expectedUser = {
        id: 1,
        email: 'example@example.com',
        role: 'admin',
      };
      userRepository.findOneBy.mockResolvedValueOnce(expectedUser);

      const result = await service.findOneBy(filter);

      expect(result).toEqual(expectedUser);
    });

    it('should return null when no user matches the filter', async () => {
      const filter = { email: 'nonexistent@example.com' };
      userRepository.findOneBy.mockResolvedValueOnce(null);

      const result = await service.findOneBy(filter);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove the user with the provided ID', async () => {
      const userId = 1;
      const userToRemove = {
        id: userId,
        email: 'example@example.com',
        role: 'admin',
      };
      userRepository.findOneBy.mockResolvedValueOnce(userToRemove);
      userRepository.remove.mockResolvedValueOnce(userToRemove);

      const result = await service.remove(userId);

      expect(result).toEqual(userToRemove);
      expect(userRepository.remove).toHaveBeenCalledWith(userToRemove);
    });

    it('should throw NotFoundException when the user does not exist', async () => {
      const userId = 999;
      userRepository.findOneBy.mockResolvedValueOnce(null);

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
    });
  });

});
