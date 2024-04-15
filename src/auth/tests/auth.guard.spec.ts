import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RequestWithUser } from '../interfaces/request-user';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../enums/roles.enum';
import { AuthGuard } from '../guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


describe('Guards', () => {

    describe('RoleGuard', () => {
        let guard: RoleGuard;
        let reflector: Reflector;
        let context: ExecutionContext;

        beforeEach(() => {
            reflector = {
                getAllAndOverride: jest.fn(),
            } as any;
            guard = new RoleGuard(reflector);
            context = {
                switchToHttp: jest.fn().mockReturnValue({
                    getRequest: jest.fn()
                }),
                getHandler: jest.fn(),
                getClass: jest.fn(),
            } as any;
        });

        it('should be defined', () => {
            expect(guard).toBeDefined();
        });

        describe('canActivate', () => {
            it('should return true if user role matches requiredRole', () => {
                // Requerido
                (reflector.getAllAndOverride as jest.Mock).mockReturnValue(Roles.ADMIN);

                // Recibido
                (context.switchToHttp as jest.Mock).mockReturnValue({
                    getRequest: jest.fn().mockReturnValue({ user: { role: Roles.ADMIN } } as RequestWithUser),
                })

                const result = guard.canActivate(context);
                expect(result).toBe(true);
            });


            it('should return false if user role not matches requiredRole', () => {
                // Requerido
                (reflector.getAllAndOverride as jest.Mock).mockReturnValue(Roles.ADMIN);

                // Recibido
                (context.switchToHttp as jest.Mock).mockReturnValue({
                    getRequest: jest.fn().mockReturnValue({ user: { role: Roles.REGULAR } } as RequestWithUser),
                })

                const result = guard.canActivate(context);

                expect(result).toBe(false);
            });
        });
    })

    describe('AuthGuard', () => {
        let guard: AuthGuard;
        let jwtService: JwtService;
        let configService: ConfigService;
        let context: ExecutionContext;

        beforeEach(() => {
            jwtService = {
                verifyAsync: jest.fn(),
            } as any;
            configService = {
                get: jest.fn().mockReturnValue('jwtSecret'),
            } as any;
            guard = new AuthGuard(jwtService, configService);
            context = {
                switchToHttp: jest.fn().mockReturnValue({
                    getRequest: jest.fn().mockReturnValue({
                        headers: {
                            authorization: 'Bearer token123',
                        },
                    }),
                }),
            } as any;
        });

        it('should be defined', () => {
            expect(guard).toBeDefined();
        });

        describe('canActivate', () => {
            it('should return true if token is valid', async () => {
                (jwtService.verifyAsync as jest.Mock).mockResolvedValueOnce({ user: 'payload' });

                const result = await guard.canActivate(context);

                expect(result).toBe(true);
                expect(context.switchToHttp().getRequest().user).toEqual({ user: 'payload' });
            });

            it('should throw UnauthorizedException if no token provided', async () => {
                context.switchToHttp().getRequest().headers.authorization = undefined;

                await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
            });

            it('should throw UnauthorizedException if token is invalid', async () => {
                (jwtService.verifyAsync as jest.Mock).mockRejectedValueOnce(new Error('Invalid token'));

                await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
            });
        });
    });
})