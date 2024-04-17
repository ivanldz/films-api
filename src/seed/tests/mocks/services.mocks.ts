export class StarWarsRepositoryMock {
  findAllFilms = jest.fn().mockResolvedValue(null);
}

export class FilmServiceMock {
  findAllFilms = jest.fn().mockResolvedValue(null);
  uploadFilm = jest.fn().mockResolvedValue(null);
}

export class UsersServiceMock {
  findAll = jest.fn().mockResolvedValue(null);
  createAdmin = jest.fn().mockResolvedValue(null);
}
