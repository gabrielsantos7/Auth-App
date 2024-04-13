import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { UserPayload } from '@interfaces/user-payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getAccount(userId: string): Promise<{ user: UserPayload }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const userPayload: UserPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
    };
    return { user: userPayload };
  }

  async updateAccount(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ user: UserPayload }> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const fieldsToUpdate = Object.keys(updateUserDto);
    for (const field of fieldsToUpdate) {
      if (!(field in UpdateUserDto)) {
        throw new BadRequestException(
          `O campo ${field} não pode ser atualizado ou não existe`,
        );
      }
      if (updateUserDto[field] === user[field]) {
        throw new BadRequestException(
          `O novo valor do campo ${field} não pode ser igual ao valor anterior`,
        );
      }
    }
    Object.assign(user, updateUserDto);
    const userPayload: UserPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
    };
    await user.save();
    console.log(user);
    return { user: userPayload };
  }

  async updateAccountPassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isPasswordMatch = await bcrypt.compare(
      updatePasswordDto.previousPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Senha anterior incorreta');
    }

    user.password = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    await user.save();
  }

  async removeAccount(userId: string): Promise<void> {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
