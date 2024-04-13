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
import { UserEssentialsDto } from '@dtos/user-essentials.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async updateAccount(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ user: UserEssentialsDto }> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const fieldsToUpdate = Object.keys(updateUserDto);
    for (const field of fieldsToUpdate) {
      if (updateUserDto[field] === user[field]) {
        throw new BadRequestException(
          `O novo valor do campo ${field} não pode ser igual ao valor anterior`,
        );
      }
    }
    Object.assign(user, updateUserDto);
    const userEssentialsDto: UserEssentialsDto = {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
    };
    await user.save();
    return { user: userEssentialsDto };
  }

  async updateAccountPassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const userToUpdate = await this.userModel.findById(userId);
    if (!userToUpdate) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isPasswordMatch = await bcrypt.compare(
      updatePasswordDto.previousPassword,
      userToUpdate.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Senha anterior incorreta');
    }

    userToUpdate.password = await bcrypt.hash(
      updatePasswordDto.newPassword,
      10,
    );
    await userToUpdate.save();
  }

  async removeAccount(userId: string): Promise<void> {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
