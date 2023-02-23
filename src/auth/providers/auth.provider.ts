import * as bcrypt from 'bcrypt';

export class AuthProvider {
  static async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePasswords(
    pass: string,
    withPath: string,
  ): Promise<boolean> {
    return bcrypt.compare(pass, withPath);
  }
}
