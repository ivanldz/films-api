export interface StarWarsFilm {
  title: string;
  opening_crawl: string;
}

export interface StarWarsFilmResponse {
  results: StarWarsFilm[];
}
