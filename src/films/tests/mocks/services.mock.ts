// Mock de UsersService
export class UsersServiceMock {
  findOneBy = jest.fn().mockResolvedValue(null);
}
