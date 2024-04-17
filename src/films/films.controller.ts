import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Film } from './entities/film.entity';
import { Page } from 'src/global/interfaces/page.interface';
import { FilmsService } from './films.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateFilm } from './dto/create-film.dto';
import { UpdateFilm } from './dto/update-film.dto';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { Roles } from 'src/auth/enums/roles.enum';
import { RequestWithUser } from 'src/auth/interfaces/request-user';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("Films")
@ApiBearerAuth()
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) { }

  @Post()
  @Auth(Roles.ADMIN)
  @UsePipes(ZodValidationPipe)
  async createFilm(
    @Req() { user }: RequestWithUser,
    @Body() film: CreateFilm,
  ): Promise<Film> {
    return this.filmsService.uploadFilm(film.title, film.description, user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getFilm(@Param('id', ParseIntPipe) id: number): Promise<Film> {
    return this.filmsService.getFilm(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllFilms(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 10,
  ): Promise<Page<Film>> {
    return this.filmsService.findAllFilms(page, pageSize);
  }

  @Put(':id')
  @Auth(Roles.ADMIN)
  @UsePipes(ZodValidationPipe)
  async updateFilm(
    @Param('id', ParseIntPipe) id: number,
    @Body() newData: UpdateFilm,
  ): Promise<Film> {
    return this.filmsService.updateFilm(id, newData);
  }

  @Delete(':id')
  @Auth(Roles.ADMIN)
  async deleteFilm(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.filmsService.deleteFilm(id);
  }
}
