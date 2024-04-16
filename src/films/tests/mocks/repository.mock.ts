export class FilmRepositoryMock {
  findAndCount = jest.fn().mockResolvedValue(null);
  findOneBy = jest.fn().mockResolvedValue(null);
  findOne = jest.fn().mockResolvedValue(null);
  remove = jest.fn().mockResolvedValue(null);
  save = jest.fn().mockResolvedValue(null);
}
