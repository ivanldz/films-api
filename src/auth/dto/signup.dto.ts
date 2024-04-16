import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  repeatePassword: z.string(),
});

export class SignUp extends createZodDto(SignUpSchema) {}
