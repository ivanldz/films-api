// Mock de UsersService
export class UsersServiceMock {
  create = jest.fn().mockResolvedValue(null);
  findOneBy = jest.fn().mockResolvedValue(null);
}

export class JwtServiceMock {
  sign = jest.fn().mockReturnValue('mockedToken');
}
