import { Roles } from 'src/auth/enums/roles.enum';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

// Clase mock para el repositorio de User 
export class UserRepositoryMock extends Repository<User> {
  // Implementacion de los métodos utilizados por UsersService

  findOne = jest.fn().mockImplementation((id: number) => {
    if (id === 1) {
      return {
        id: 1,
        email: 'example@example.com',
        role: Roles.ADMIN
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
        role: Roles.ADMIN
      };
    } else {
      return null;
    }
  });

  save = jest.fn().mockImplementation((user: User) => {
    return Promise.resolve({
      id: 1,
      ...user
    });
  });

  update = jest.fn().mockImplementation((id: number, user: Partial<User>) => {
    if (id === 1) {
      return {
        id: 1,
        ...user
      };
    } else {
      return null;
    }
  });
}
