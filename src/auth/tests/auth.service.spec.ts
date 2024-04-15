import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from 'bcrypt';
import { AuthService } from "../auth.service";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { JwtServiceMock, UsersServiceMock } from "./mocks/services.mock";
import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { Roles } from "../enums/roles.enum";


describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersServiceMock;
    let jwtService: JwtService
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useClass: UsersServiceMock },
                { provide: JwtService, useClass: JwtServiceMock },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get(UsersService);
        jwtService = module.get(JwtService)
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('signUp', () => {
        it('should create a new user', async () => {
            try {
                await service.signUp({
                    email: 'test@example.com',
                    password: 'password',
                    repeatePassword: 'password'
                });
            } catch { }
            expect(usersService.create).toHaveBeenCalledWith('test@example.com', 'password', 'admin');
        });

        it('should throw BadRequestException if passwords do not match', async () => {
            const signUpData = { email: 'test@example.com', password: 'password', repeatePassword: 'differentPassword' };

            await expect(service.signUp(signUpData)).rejects.toThrow(BadRequestException);
            expect(usersService.create).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should return successful login if user exists and password is correct', async () => {
            const loginData = { email: 'test@example.com', password: 'password' };
            const mockedUser = {
                email: 'test@example.com',
                hash: await bcrypt.hash('password', 10),
                role: Roles.ADMIN
            };
            usersService.findOneBy.mockResolvedValueOnce(mockedUser);
            const expectedResult = { message: 'AUTHORIZE', user: mockedUser, token: 'mockedToken', expiration: expect.any(Number) };

            const result = await service.login(loginData);
            expect(result).toEqual(expectedResult);
        });

        it('should throw NotFoundException if user does not exist', async () => {
            const loginData = { email: 'nonexistent@example.com', password: 'password' };

            await expect(service.login(loginData)).rejects.toThrow(NotFoundException);
            expect(jwtService.sign).not.toHaveBeenCalled();
        });

        it('should throw ForbiddenException if password is incorrect', async () => {
            const loginData = { email: 'test@example.com', password: 'incorrectPassword' };
            const mockedUser = { email: 'test@example.com', hash: await bcrypt.hash('password', 10), role: Roles.ADMIN };
            usersService.findOneBy.mockResolvedValueOnce(mockedUser);

            await expect(service.login(loginData)).rejects.toThrow(ForbiddenException);
            expect(jwtService.sign).not.toHaveBeenCalled();
        });
    });

    describe('getProfile', () => {
        it('should return successful login with user details', async () => {
            const mockedUser = { email: 'test@example.com', role: 'ADMIN' };
            usersService.findOneBy.mockResolvedValueOnce(mockedUser);
            const expectedResult = { message: 'OK', user: mockedUser, token: 'mockedToken', expiration: expect.any(Number) };

            const result = await service.getProfile('test@example.com');

            expect(result).toEqual(expectedResult);
            expect(jwtService.sign).toHaveBeenCalled();
        });

        it('should throw NotFoundException if user does not exist', async () => {
            usersService.findOneBy.mockResolvedValueOnce(null);

            await expect(service.getProfile('nonexistent@example.com')).rejects.toThrow(NotFoundException);
            expect(jwtService.sign).not.toHaveBeenCalled();
        });
    });
});