import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { EmailAlreadyExistsException } from 'src/exceptions/email-already-exists.exception';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('/signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ token: string; user: UserDto }> {
    try {
      return await this.authService.signUp(signUpDto);
    } catch (err) {
      if (err instanceof EmailAlreadyExistsException) {
        throw new HttpException(
          'E-mail já está sendo usado',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UsePipes(ValidationPipe)
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ token: string; user: UserDto }> {
    try {
      return this.authService.login(loginDto);
    } catch (err) {
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
