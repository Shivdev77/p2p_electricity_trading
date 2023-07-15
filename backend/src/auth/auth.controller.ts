import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategies/local/local-auth.guard';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  private readonly commonCookieOptions: CookieOptions = {
    httpOnly: true,
    domain: this.configService.get('FRONTEND_DOMAIN').includes('localhost')
      ? null
      : this.configService.get('FRONTEND_DOMAIN'),
    secure: true,
    sameSite: 'strict',
  };

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
    @Body('keepLoggedIn') keepLoggedIn: boolean,
  ) {
    const { userId, username, name } = req.user;
    return this.authService.loginUser(
      userId,
      username,
      name,
      res,
      this.commonCookieOptions,
      keepLoggedIn
        ? this.configService.get('JWT_LONG_EXPIRY_TIME')
        : this.configService.get('JWT_SHORT_EXPIRY_TIME'),
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('create-account')
  async createAccount(
    @Body() createUserDto: Record<string, any>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService
      .createUser(createUserDto)
      .catch((err) => {
        if (err.code === 'P2002') {
          // Unique constraint failed on the {constraint}
          throw new ConflictException();
        }
        console.error(err);
        throw new BadRequestException();
      });

    const { userId, username, name } = user;
    return this.authService.loginUser(
      userId,
      username,
      name,
      res,
      this.commonCookieOptions,
      this.configService.get('JWT_SHORT_EXPIRY_TIME'),
    );
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', this.commonCookieOptions).send('ACCEPTED');
  }
}
