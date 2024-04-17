import { Roles } from 'src/auth/enums/roles.enum';
import { User } from 'src/users/entities/user.entity';

export class UserRepositoryMock {
  findOne = jest.fn().mockImplementation((id: number) => {
    if (id === 1) {
      return {
        id: 1,
        email: 'example@example.com',
        role: Roles.ADMIN,
      };
    } else {
      return null;
    }
  });

  findOneBy = jest.fn().mockImplementation((conditions: Partial<User>) => {
    if (conditions.email === 'example@example.com') {
      return {
        id: 1,
        email: 'example@example.com',
        role: Roles.ADMIN,
      };
    } else {
      return null;
    }
  });

  save = jest.fn().mockImplementation((user: User) => {
    return Promise.resolve({
      id: 1,
      ...user,
    });
  });

  findAndCount = jest.fn().mockImplementation(() => {
    return [
      [
        {
          id: 1,
          email: 'user1@example.com',
          hash: '',
          role: Roles.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          email: 'user2@example.com',
          hash: '',
          role: Roles.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      2,
    ];
  });

  remove = jest.fn();
}
