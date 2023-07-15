import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.user({
      username,
    });
    if (user && (await argon2.verify(user.passwordHash, password))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async createUser(createUserDto: Record<string, any>) {
    const { username, password, name } = createUserDto;
    const passwordHash = await argon2.hash(password);
    return this.usersService.createUser({
      username,
      name,
      passwordHash,
      verified: false,
    });
  }

  generateJwt(user: any, timeToExpiry: number) {
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload, { expiresIn: timeToExpiry });
  }

  loginUser(
    userId: string,
    username: string,
    name: string,
    res: Response,
    commonCookieOptions: CookieOptions,
    timeToExpiry: number,
  ) {
    const jwt = this.generateJwt(
      {
        userId,
        username,
      },
      timeToExpiry,
    );
    res.cookie('jwt', jwt, { ...commonCookieOptions, maxAge: timeToExpiry });
    return {
      userId,
      username,
      name,
    };
  }
}
