import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@users/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class UploadsModule {}
