import { User } from "src/users/entities/user.entity";

export interface SuccessfulLogin {
  message: string;
  user: User;
  token: string;
  expiration: number;
}
