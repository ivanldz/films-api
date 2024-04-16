import { User } from '../entities/user.entity';

export interface UserList extends Pick<User, 'id' | 'email' | 'role'> {}
