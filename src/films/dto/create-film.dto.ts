import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateFilmSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(1000),
});

export class CreateFilm extends createZodDto(CreateFilmSchema) {}
