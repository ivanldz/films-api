import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Film } from './entities/film.entity';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from 'src/global/interfaces/page.interface';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
    private readonly userService: UsersService,
  ) {}

  async uploadFilm(
    title: string,
    description: string,
    uploadedById: number,
  ): Promise<Film> {
    const uploadedBy = await this.userService.findOneBy({ id: uploadedById });
    if (!uploadedBy) {
      throw new Error('User not found');
    }

    const film = new Film();
    film.title = title;
    film.description = description;
    film.uploadedBy = uploadedBy;

    return await this.filmsRepository.save(film);
  }

  async getFilm(id: number): Promise<Film> {
    const film = await this.filmsRepository.findOne({
      where: { id },
      relations: ['uploadedBy'],
      select: [
        'id',
        'title',
        'description',
        'createdAt',
        'updatedAt',
        'uploadedBy',
      ],
    });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    return film;
  }

  async findAllFilms(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Page<Film>> {
    if (page < 1) {
      throw new BadRequestException('Page number must be greater than 0');
    }

    if (pageSize < 1 || pageSize > 20) {
      throw new BadRequestException('Page size must be between 0 and 20');
    }

    const [records, total] = await this.filmsRepository.findAndCount({
      select: ['id', 'title', 'uploadedBy', 'createdAt'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      records,
      paginations: {
        page,
        pageSize,
        totalPages,
      },
    };
  }

  async updateFilm(id: number, newData: Partial<Film>): Promise<Film> {
    const film = await this.filmsRepository.findOneBy({ id });
    if (!film) {
      throw new NotFoundException('Film not found');
    }

    // Aplicar los nuevos datos a la película
    Object.assign(film, newData);

    const updatedFilm = await this.filmsRepository.save(film);
    return updatedFilm;
  }

  async deleteFilm(id: number): Promise<boolean> {
    const film = await this.filmsRepository.findOneBy({ id });
    if (!film) {
      throw new NotFoundException('Film not found');
    }
    await this.filmsRepository.remove(film);
    return true;
  }
}
