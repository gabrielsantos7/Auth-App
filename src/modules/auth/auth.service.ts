import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { EmailAlreadyExistsException } from '@exceptions/email-already-exists.exception';
import { UserPayload } from '@interfaces/user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ token: string; user: UserPayload }> {
    const { name, email, password } = signUpDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = this.jwtService.sign({ id: user._id });
    const userPayload: UserPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
    };
    return { token, user: userPayload };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ token: string; user: UserPayload }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.jwtService.sign({ id: user._id });
    const userPayload: UserPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
    };

    return {
      token,
      user: userPayload,
    };
  }
}
