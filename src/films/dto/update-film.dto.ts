import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateFilmSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
});

export class UpdateFilm extends createZodDto(UpdateFilmSchema) {}
