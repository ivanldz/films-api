import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UserRepositoryMock } from './mocks/repository.mock';
import { Roles } from 'src/auth/enums/roles.enum';
import { NotFoundException } from '@nestjs/common';
import { userMock } from 'src/films/tests/mocks/values.mock';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: UserRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useClass: UserRepositoryMock,
        },
      ],
    }).compile();
    userRepository = module.get<UserRepositoryMock>('UserRepository');
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and have their hashes defined', async () => {
      const newUser = await service.create(
        'test@test.com',
        '123',
        Roles.REGULAR,
      );

      expect(newUser).toBeDefined();
      expect(newUser.hash).toBeDefined();
    });

    it('fails if the user already exists', async () => {
      jest.spyOn(userRepository, 'findAndCount').mockResolvedValue(true);
      expect(
        service.create('example@example.com', '123', Roles.REGULAR),
      ).rejects.toThrow('user email already exists');
    });
  });

  describe('createAdmin', () => {
    it('The user is a admin', async () => {
      const newUser = await service.createAdmin('test@example.com', '123');
      expect(newUser.role).toBe(Roles.ADMIN);
    });
  });

  describe('setAdmin', () => {
    it('The user is reglar but next is admin', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(userMock);

      const user = await service.setAdmin(1);
      expect(user.role).toBe(Roles.ADMIN);
    });

    it('Fail if user does not exist', () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      expect(service.setAdmin(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUser', () => {
    it('Get the user', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({ id: 1 });
      const user = await service.getUser(1);
      expect(user).toBeDefined();
    });

    it('Get the user', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.getUser(1)).rejects.toThrow("user not found");
    });
  });

  describe('findAll', () => {
    it('should return a page of users', async () => {
      const pageSize = 10;
      const page = 1;

      const result = await service.findAll(page, pageSize);
      expect(result.records.length).toBeDefined();
      expect(result.paginations.page).toEqual(page);
      expect(result.paginations.pageSize).toEqual(pageSize);
      expect(result.paginations.totalPages).toEqual(1);
    });

    it('should throw an error if page is negative', async () => {
      const page = -1;
      const pageSize = 10;
      await expect(service.findAll(page, pageSize)).rejects.toThrow(
        'Page number must be greater than 0',
      );
    });

    it('should throw an error if pageSize is negative', async () => {
      const page = 1;
      const pageSize = -1;
      await expect(service.findAll(page, pageSize)).rejects.toThrow(
        'Page size must be between 0 and 20',
      );
    });

    it('should throw an error if pageSize is greater to 20', async () => {
      const page = 1;
      const pageSize = 100;
      await expect(service.findAll(page, pageSize)).rejects.toThrow(
        'Page size must be between 0 and 20',
      );
    });
  });
  describe('findOneBy', () => {
    it('should return the user when a valid filter is provided', async () => {
      const filter = { email: 'example@example.com' };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(userMock);

      const result = await service.findOneBy(filter);

      expect(result).toEqual(userMock);
    });

    it('should return null when no user matches the filter', async () => {
      const filter = { email: 'nonexistent@example.com' };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.findOneBy(filter);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove the user with the provided ID', async () => {
      const userId = 1;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(userMock);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(userMock);

      const result = await service.remove(userId);

      expect(result).toEqual(userMock);
      expect(userRepository.remove).toHaveBeenCalledWith(userMock);
    });

    it('should throw NotFoundException when the user does not exist', async () => {
      const userId = 999;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
