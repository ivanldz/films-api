import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { SuccessfulLogin } from './interfaces/successful-login';
import { AuthService } from './auth.service';
import { Login } from './dto/login.dto';
import { SignUp } from './dto/signup.dto';
import { RequestWithUser } from './interfaces/request-user';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UsePipes(ZodValidationPipe)
  login(@Body() login: Login): Promise<SuccessfulLogin> {
    return this.authService.login(login);
  }

  @Post('signup')
  @UsePipes(ZodValidationPipe)
  signUp(@Body() signUp: SignUp): Promise<SuccessfulLogin> {
    return this.authService.signUp(signUp);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async profile(@Request() req: RequestWithUser): Promise<SuccessfulLogin> {
    return this.authService.getProfile(req.user.email);
  }
}
