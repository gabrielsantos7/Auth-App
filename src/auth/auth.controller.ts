import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Param,
  Patch,
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
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

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

  @UseGuards(AuthGuard())
  @Patch('/users/:id/account')
  async updateAccount(
    @Req() req,
    @Param('id') id: string,
    @Body() partialUpdateUserDto: Partial<UpdateUserDto>,
  ): Promise<void> {
    const userId = req.user.id;
    if (id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esta conta',
      );
    }

    try {
      await this.authService.updateUser(id, partialUpdateUserDto);
    } catch (err) {
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard())
  @Patch('/users/:id/password')
  updatePassword(
    @Req() req,
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.id;
    if (id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esta conta',
      );
    }

    // return this.userService.updateUser(userId, updateUserDto);
  }

  @UseGuards(AuthGuard())
  @Delete('users/:id')
  remove(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    if (id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esta conta',
      );
    }

    // return this.userService.updateUser(userId, updateUserDto);
    return `This action removes a #${id} cat`;
  }
}
