import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'O e-mail já está sendo usado'] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  photoUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
