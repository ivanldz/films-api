import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { Login } from "./dto/login.dto";
import { SuccessfulLogin } from "./interfaces/successful-login";
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "src/users/users.service";
import { ConfigService } from "@nestjs/config";
import { User } from "src/users/entities/user.entity";
import { PayloadToken } from "./interfaces/payload-jwt";
import { SignUp } from "./dto/signup.dto";
import { Roles } from "./enums/roles.enum";

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UsersService
    ) { }

    async signUp({ email, password, repeatePassword }: SignUp): Promise<SuccessfulLogin> {
        if (password !== repeatePassword) {
            throw new BadRequestException('Passwords not match');
        }

        await this.userService.create(email, password, Roles.ADMIN)
        return this.login({ email, password })
    }

    async login({ email, password }: Login): Promise<SuccessfulLogin> {
        const user = await this.userService.findOneBy({ email: email });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const passwordValid = await bcrypt.compare(password, user.hash);
        if (!passwordValid) {
            throw new ForbiddenException('Passowrd incorrect');
        }

        return {
            message: 'AUTHORIZE',
            user: user,
            token: this.getJwt(user),
            expiration: this.getExpiration(),
        };
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userService.findOneBy({ email: email });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const token = await this.userService.resetPasswordToken(user.id);
        const host = this.configService.get<string>('HOST');
        const link = `${host}/generar-contrasena?token=${token}`;
        const sender = this.configService.get<string>('EMAIL_USER');
        // await this.mailerService.sendMail({
        //     to: user.email,
        //     from: sender,
        //     subject: 'Recupera tu contraseña',
        //     template: 'reset-password',
        //     context: { email, link },
        // });
    }

    async resetPassword(
        token: string,
        password: string,
        repeatePassword: string,
    ): Promise<void> {
        if (password !== repeatePassword) {
            throw new BadRequestException('Password not match');
        }
        const user = await this.userService.findOneBy({
            resetPasswordToken: token,
        });

        if (!user) {
            throw new NotFoundException('Token not associated with any user');
        }

        return this.userService.savePassword(user, password);
    }

    async getProfile(email: string): Promise<SuccessfulLogin> {
        const user = await this.userService.findOneBy({ email: email });
        return {
            message: 'OK',
            user: user,
            token: this.getJwt(user),
            expiration: this.getExpiration(),
        };
    }

    private getJwt({ email, role }: User): string {
        const tokenPayload: PayloadToken = { email, role };
        return this.jwtService.sign(tokenPayload, { expiresIn: '1h' });
    }

    private getExpiration(): number {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        return now + oneHour;
    }
}
