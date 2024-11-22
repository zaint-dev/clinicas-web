import { Role } from './role';

export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: Role;
  token?: string;
  tokenType?: string;
  expiresIn?: number;
  refreshToken?: string;
}
