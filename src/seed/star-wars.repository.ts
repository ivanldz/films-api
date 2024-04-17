import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { StarWarsFilmResponse } from './interfaces/star-wars.interface';
import { AxiosResponse } from 'axios';

// Repositorio de la api de starwars
@Injectable()
export class StarWarsRepository {
  constructor(private readonly httpService: HttpService) {}

  findAllFilms(): Promise<AxiosResponse<StarWarsFilmResponse>> {
    return this.httpService.axiosRef.get('https://swapi.dev/api/films/');
  }
}
