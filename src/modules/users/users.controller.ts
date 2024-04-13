import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UserPayload } from '@interfaces/user-payload.interface';
import { AuthenticatedRequest } from '@interfaces/request.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  @Patch('/account')
  async updateAccount(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ user: UserPayload }> {
    const userId = req.user.id;
    try {
      return this.usersService.updateAccount(userId, updateUserDto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  @Patch('/password')
  async updateAccountPassword(
    @Req() req: AuthenticatedRequest,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.id;
    if (updatePasswordDto.previousPassword === updatePasswordDto.newPassword) {
      throw new HttpException(
        'A nova senha deve ser diferente da senha anterior',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.usersService.updateAccountPassword(userId, updatePasswordDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      } else if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error instanceof InternalServerErrorException) {
        throw new HttpException(
          'Erro interno do servidor',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'Erro inesperado',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @UseGuards(AuthGuard())
  @Delete('/delete')
  async removeAccount(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    try {
      await this.usersService.removeAccount(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'Erro interno do servidor',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
