import { Roles } from 'src/auth/enums/roles.enum';
import { Film } from 'src/films/entities/film.entity';
import { User } from 'src/users/entities/user.entity';

export const userMock: User = {
  id: 1,
  email: 'admin@admin.com',
  hash: 'hash',
  role: Roles.ADMIN,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const filmMock: Film = {
  id: 1,
  title: 'Test Film',
  description: 'Test Description',
  uploadedBy: userMock,
  createdAt: new Date(),
  updatedAt: new Date(),
};
