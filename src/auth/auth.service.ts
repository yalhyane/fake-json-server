import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthProvider } from './providers/auth.provider';
import { User } from '../users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.getUser({
      email,
    });
    if (!user) {
      //      throw new NotAcceptableException('could not find the user');
      return null;
    }
    const passwordValid = await AuthProvider.comparePasswords(
      pass,
      user.password,
    );
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
