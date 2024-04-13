import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@users/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async uploadPhoto(userId: string, filePath: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    user.photoUrl = filePath;
    await user.save();
  }
}
