import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
  providers: [UsersService],
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
})
export class UsersModule {}
