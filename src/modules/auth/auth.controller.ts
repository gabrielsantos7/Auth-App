import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { EmailAlreadyExistsException } from '@exceptions/email-already-exists.exception';
import { multerOptions } from '@config/multer.config';
import { UserEssentialsDto } from '@dtos/user-essentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('/signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ token: string; user: UserEssentialsDto }> {
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
  ): Promise<{ token: string; user: UserEssentialsDto }> {
    try {
      return this.authService.login(loginDto);
    } catch (err) {
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard())
  @Post('photo')
  @UseInterceptors(FileInterceptor('photo', multerOptions))
  async uploadPhoto(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new HttpException(
        'Por favor, envie uma imagem',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.authService.uploadPhoto(req.user.id, file.path);
      const photoUrl = file.path.replace('uploads\\', '/').replace(/\\/g, '/');
      return { photoUrl };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'Erro interno do servidor',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
